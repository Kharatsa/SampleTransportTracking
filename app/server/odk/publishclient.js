'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const Sequelize = require('sequelize');
const log = require('app/server/util/log.js');
const odkAggregate = require('app/server/odk/aggregateapi.js');
const parser = require('app/server/util/xmlconvert.js');
const odkTransform = require('app/server/odk/aggregatetransform.js');

/**
 * Enum covering the formIds currently supported by the sample tracking service.
 * @enum {String}
 */
const supportedForms = {
  SAMPLE_ORIGIN: 'sample-origin',
  SAMPLE_DEPARTURE: 'sample-departure',
  SAMPLE_ARRIVAL: 'sample-arrival',
  LAB_LINK: 'lab-link',
  LAB_STATUS: 'lab-status',
  RESULT_DEPARTURE: 'result-departure',
  RESULT_ARRIVAL: 'result-arrival'
};

const supportedFormIds = Object.keys(supportedForms).map(function(key) {
  return supportedForms[key];
});

function syncFormList() {
  log.debug('Sychronizing ODK Aggregate form list');

  return odkAggregate.formList()
  .then(function(xml) {
    return parser.parseXML(xml);
  })
  .then(function(formListObj) {
    return odkTransform.getFormIds(formListObj);
  })
  .tap(function(forms) {
    log.info('Retrieved ODK Aggregate form list ', forms);

    var serverFormIds = forms.map(function(form, i) {
      return {formId: form.formId, name: form.name, index: i};
    });

    Bluebird.each(serverFormIds, function checkForms(form) {
      if (_.indexOf(supportedFormIds, form.formId) === -1) {
        log.error('Unsupported ODK Aggregate form ' +
          JSON.stringify(forms[form.index]));
      }
    });
  });
}

/**
 * PublishClient handles data delivered by the ODK Aggregate "Simple JSON
 * publisher."
 *
 * https://github.com/opendatakit/opendatakit/wiki/Aggregate-Publishers-Implementation-Details
 *
 * @param {Object} dbClient  [description]
 */
function PublishClient(dbClient) {
  log.debug('Creating PublishClient');
  this.dbClient = dbClient;

  syncFormList(this.dbClient)
  .bind(this)
  .then(function(forms) {
    return this.saveFormList(forms);
  });
}

PublishClient.prototype.saveFormList = function(forms) {
  log.debug('Saving form list', forms);

  var Model = this.dbClient.Forms;
  return this.dbClient.db.transaction(function(tran) {
    return Bluebird.map(forms, function(form) {
      return {formId: form.formId, formName: form.name};
    })
    .bind(this)
    .each(function(form) {
      return Model.findOrCreate({
        where: {formId: form.formId},
        defaults: {formName: form.name},
        transaction: tran
      });
    });
  });
};

/**
 * Enum for ODK Aggregate form-level fields
 * @enum {String}
 */
const formFields = {
  FORM_ID: 'formId'
};

/**
 * Enum for ODK Aggregate form fields relevant to sample Ids
 * @enum {String}
 */
const sampleIdFields = {
  SAMPLE_TRACKING_ID: 'st_barcode',
  LAB_ID: 'lab_barcode'
};

/**
 * Persists the component pieces of a submission to various local database
 * tables. These components are:
 *   * Sample IDs (sample and lab)
 *   * STEvents (sample Id, form Id, instance/submission Id)
 *
 * @param  {Object} submission  A form submission from ODK Aggregate's Simple
 *                              JSON publisher.
 * @return {Promise}            Resolved when the data is all committed to the
 *                                       database, and otherwise rejected.
 */
PublishClient.prototype.saveSubmission = function(submission) {
  var formId = submission[formFields.FORM_ID];
  log.debug('Save new "' + formId + '" form submission', submission);

  var self = this;
  return this.dbClient.db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, function(tran) {
    return self._saveSampleIds(submission.data, tran)
    .then(function() {
      return self._saveSTEvent(formId, submission.data, tran);
    })
    .then(function() {
      // TODO: only save fields if STEvent was created (i.e., non-dupe)
      return self._saveSubmissionData(formId, submission.data, tran);
    });
  })
  .then(function(result) {
    log.debug('Finished COMMITTING form submission', result);
  });
};

/**
 * Persists the sample identifiers to the database. Submission data should
 * always include at least one sample ID field. Some forms may include only one
 * sample ID, while others might include all.
 *
 * @param  {Object[]} submissionData  An array of fields for the submission
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise}                  Boolean reporting whether the row was
 *                                            created or updated. Note: SQLite
 *                                            returns undefined for upserts.
 */
PublishClient.prototype._saveSampleIds = function(submissionData, tran) {
  log.debug('Saving SAMPLE IDS from submission');

  var Model = this.dbClient.SampleIds;
  return Bluebird.map(submissionData, function(data) {
    // Pull the Id values from data. Parse to int if present.
    var newStId = data[sampleIdFields.SAMPLE_TRACKING_ID] || null;
    newStId = newStId ? parseInt(newStId) : newStId;
    var newLabId = data[sampleIdFields.LAB_ID] || null;
    newLabId = newLabId ? parseInt(newLabId) : newLabId;

    return {stId: newStId, labId: newLabId};
  })
  .each(function(id) {
    log.debug('findOrCreate sample identifiers', id);
    // Check if a record exists for this SampleId already. An existing record
    // will have either a matching, non-null stId or labId.
    return Model.findOrCreate({
      where: {$or: [
        {$and: [{stId: id.stId}, {stId: {ne: null}}]},
        {$and: [{labId: id.labId}, {labId: {ne: null}}]}
      ]},
      defaults: {
        stId: id.stId,
        labId: id.labId
      },
      transaction: tran
    })
    .spread(function(sampleId, created) {
      log.debug('Local SampleId', sampleId.get({plain: true}));
      if (created) {
        log.debug('Created NEW SampleID');
      } else if (sampleId.stId !== id.stId || sampleId.labId !== id.labId) {
        // Update the sampleID record if necessary
        log.debug('Updating EXISTING SampleID');
        sampleId.stId = id.stId;
        sampleId.labId = id.labId;
        return sampleId.save({
          transaction: tran
        });
      }
    });
  });
};

/**
 * Enum for ODK Aggregate form fields relevant to events
 * @enum {String}
 */
const eventFields = {
  INSTANCE_ID: 'instanceID',
  FORM_END_DATE: 'end',
  COMPLETED_DATE: '*meta-date-marked-as-complete*'
};
_.assign(eventFields, sampleIdFields);

/**
 * Persists the sample, form, and submission IDs for a submission to the
 * database.
 *
 * @param  {Object}   formId          [description]
 * @param  {Object[]} submissionData  [description]
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise}                  [description]
 */
PublishClient.prototype._saveSTEvent = function(formId, submissionData, tran) {
  log.debug('Saving EVENTS from submission');

  var STEventModel = this.dbClient.STEvents;
  return Bluebird.map(submissionData, function(data) {
    return {
      sampleId: (
        data[eventFields.SAMPLE_TRACKING_ID] ||
        data[eventFields.LAB_ID]),
      formId: formId,
      instanceId: data[eventFields.INSTANCE_ID],
      formEndDate: data[eventFields.FORM_END_DATE],
      odkCompletedDate: data[eventFields.COMPLETED_DATE]
    };
  })
  .each(function(stEvent) {
    return STEventModel.findOrCreate({
      where: {instanceId: stEvent.instanceId},
      defaults: stEvent,
      transaction: tran
    })
    .spread(function(stEvent, created) {
      log.debug('DB STEvent', stEvent.get({plain: true}));
      if (created) {
        log.debug('Created NEW STEvent');
      } else {
        log.debug('STEvent EXISTS. Skipping insert.');
      }
    });
    // return STEventModel.create(stEvent, {transaction: tran});
  });
};
/**
 * Enum for ODK Aggregate form fields relevant to data storage
 * @enum {String}
 */
const formDataFields = {
  INSTANCE_ID: 'instanceID',
};

/**
 * Persists the submission instance data fields to the database. Each field is
 * stored as its own row in the database. This approach avoids the need to
 * recreate the form's model schema in this local database.
 *
 * @param  {Object}   formId          [description]
 * @param  {Object[]} submissionData  [description]
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise}                  [description]
 */
PublishClient.prototype._saveSubmissionData = function(formId, submissionData,
                                                       tran) {
  log.debug('Saving FIELD DATA from submission');

  var FormDataModel = this.dbClient.FormData;
  return Bluebird.map(submissionData, function(data) {
    var instanceId = data[formDataFields.INSTANCE_ID];
    return Bluebird.map(Object.keys(data), function(field) {
      return {
        formId: formId,
        instanceId: instanceId,
        fieldLabel: field,
        fieldValue: data[field]
      };
    })
    .all(function(subsData) {
      log.debug('FIELD DATA total fields: ', subsData.length);
      return FormDataModel.bulkCreate(subsData, {
        transaction: tran,
        logging: log.debug
      });
    })
    .catch(function(err) {
      log.error('Error saving FIELD DATA', err);
    })
    .then(function(fieldEntries) {
      log.debug('Instances for the newly created FIELD DATA', fieldEntries);
    });
  });
};

module.exports = PublishClient;
