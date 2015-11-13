'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
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
  .spread(function(listRes, listBody) {
    return parser.parseXML(listBody);
  })
  .then(function(formListObj) {
    return odkTransform.getFormIds(formListObj);
  })
  .tap(function(forms) {
    log.info('Retrieved ODK Aggregate form list ', forms);

    var serverFormIds = forms.map(function(form, i) {
      return {formId: form.formId, name: form.name, index: i};
    });

    BPromise.each(serverFormIds, function checkForms(form) {
      if (_.indexOf(supportedFormIds, form.formId) === -1) {
        log.warn('Unrecognized ODK Aggregate form ' +
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

/**
 * Stores the latest form list from ODK in the local DB.
 *
 * @param  {Object}   forms The parsed /formList object from ODK
 * @return {Promise}        Resolved on successful sync
 */
PublishClient.prototype.saveFormList = function(forms) {
  var FormsModel = this.dbClient.Forms;
  return this.dbClient.db.transaction(function(tran) {
    return BPromise.map(forms, function(form) {
      return {formId: form.formId, formName: form.name};
    })
    .bind(this)
    .map(function(form) {
      return FormsModel.findOrCreate({
        where: {formId: form.formId},
        defaults: {formName: form.name},
        transaction: tran
      });
    })
    .then(function(forms) {
      log.info('Successfully processed ' + forms.length + ' forms');
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
 * Persists the component pieces of a submission to various local database
 * tables. These components are:
 *   * Sample IDs (sample and lab)
 *   * TrackerEvents (sample Id, form Id, instance/submission Id)
 *   * SubmissionData (all the fields)
 *
 * @param  {Object} submission  A form submission from ODK Aggregate's Simple
 *                              JSON publisher.
 * @return {Promise}            Resolved when the data is all committed to the
 *                                       database, and otherwise rejected.
 */
PublishClient.prototype.saveSubmission = function(submission) {
  var formId = submission[formFields.FORM_ID];
  log.info('New `' + formId + '` form submission', submission);

  var self = this;
  return this.dbClient.db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, function(tran) {
    return BPromise.map(submission.data, function(entry) {
      return BPromise.props({
        sampleIds: parseSampleIds(entry),
        trackerEvents: parseEvents(formId, entry),
        fieldData: parseFieldData(formId, entry)
      });
    })
    .each(function(parsed, index, length) {
      log.debug('saveSubmission parsed result ' + (index + 1) + ' of ' + length);
      log.debug(parsed);
      return self._saveSampleIds(parsed.sampleIds, tran)
      .spread(function(sampleIdInstance, created) {
        log.debug('saveSubmission completed sampleId insert',
          sampleIdInstance.get({plain:true}), created);
        return self._saveSTEvent(formId, parsed.trackerEvents, tran);
      })
      .spread(function(trackEventInstance, created) {
        log.debug('saveSubmission completed trackEvent insert',
          trackEventInstance.get({plain:true}), created);
        return self._saveFieldData(formId, parsed.fieldData,
          trackEventInstance.get('instanceId'), tran);
      })
      .then(function() {
        log.debug('Finished inserts');
      });
    });
  })
  .then(function(result) {
    log.info('Finished COMMITTING form submission', result);
  });
};

/**
 * Enum for ODK Aggregate form fields relevant to sample Ids
 * @enum {String}
 */
const sampleIdFields = {
  SAMPLE_TRACKING_ID: 'stid',
  LAB_ID: 'labid'
};

function parseSampleIds(data) {
  // Pull the Id values from data. Parse to int if present.
  var newStId = data[sampleIdFields.SAMPLE_TRACKING_ID] || null;
  var newLabId = data[sampleIdFields.LAB_ID] || null;

  return {stId: newStId, labId: newLabId};
}

var maybeUpdateSampleId = BPromise.method(function(newId, localId, tran) {
  log.info('Maybe update local SampleId', localId.get({plain: true}));

  if (localId.stId !== newId.stId || localId.labId !== newId.labId) {
    log.info('Updating SampleID');
    localId.stId = newId.stId;
    localId.labId = newId.labId;
    return localId.save({
      transaction: tran
    });
  } else {
    log.info('SampleID does not require update');
  }
  return localId;
});

/**
 * Persists the sample identifiers to the database. Submission data should
 * always include at least one sample ID field. Some forms may include only one
 * sample ID, while others might include all.
 *
 * @param  {Object} sampleId              A single parsed object parsed from
 *                                        submission data containing the sample
 *                                        ID values (i.e., the sampleId object
 *                                        may contain 1 or more "ids" that can
 *                                        identify a sample.
 * @param  {Object}   tran                Sequelize transaction
 * @return {Promise.<Instance, created>}  Whether the row was created or updated.
 */
PublishClient.prototype._saveSampleIds = function(sampleId, tran) {
  log.debug('Saving SAMPLE IDS from submission', sampleId);
  var SampleIdsModel = this.dbClient.SampleIds;

  // Check if a record exists for this SampleId already. An existing record
  // will have either a matching, non-null stId or labId.
  return SampleIdsModel.findOrCreate({
    where: {$or: [
      {$and: [{stId: sampleId.stId}, {stId: {ne: null}}]},
      {$and: [{labId: sampleId.labId}, {labId: {ne: null}}]}
    ]},
    defaults: {stId: sampleId.stId, labId: sampleId.labId},
    transaction: tran
  })
  .spread(function(sampleIdInstance, created) {
    var args = Array.prototype.slice.call(arguments);

    if (!created) {
      return maybeUpdateSampleId(sampleId, sampleIdInstance, tran)
      .then(function() {
        return args;
      })
    }
    log.info('Created new SampleID', sampleIdInstance.get({plain: true}));

    // Pass arguments back out (i.e., treat this spread like a tap call)
    return args;
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
 * [parseEvents description]
 *
 * @param  {String}   formId         [description]
 * @param  {Object[]} data           [description]
 * @return {Promise}                 [description]
 */
function parseEvents(formId, data) {
  return {
    stId: data[eventFields.SAMPLE_TRACKING_ID] || null,
    labId: data[eventFields.LAB_ID] || null,
    formId: formId,
    instanceId: data[eventFields.INSTANCE_ID],
    formEndDate: data[eventFields.FORM_END_DATE],
    odkCompletedDate: data[eventFields.COMPLETED_DATE]
  };
}

/**
 * Persists the sample, form, and submission IDs for a submission to the
 * database.
 *
 * @param  {String}   formId          [description]
 * @param  {Object[]} trackerEventsData    A single parsed ST Event object from
 *                                    submission data.
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise.<Instance,Boolean>}         [description]
 */
PublishClient.prototype._saveSTEvent = function(formId, stEvent, tran) {
  log.debug('Saving EVENTS from submission', stEvent);

  var STEventModel = this.dbClient.TrackerEvents;

  // The sample Id values included in this
  return STEventModel.findOrCreate({
    where: {instanceId: stEvent.instanceId},
    defaults: stEvent,
    transaction: tran
  });
};
/**
 * Enum for ODK Aggregate form fields relevant to data storage
 * @enum {String}
 */
const submissionDataFields = {
  INSTANCE_ID: 'instanceID',
};

/**
 * Transforms the submission data object into an array of objects. Each array
 * value contains one field and value pair.
 *
 * @param  {String} formId
 * @param  {Object} data
 * @return {Object[]}
 */
function parseFieldData(formId, data) {
  var instanceId = data[submissionDataFields.INSTANCE_ID];
  return BPromise.map(Object.keys(data), function(field) {
    return {
      formId: formId,
      instanceId: instanceId,
      fieldLabel: field,
      fieldValue: data[field]
    };
  });
}

/**
 * Persists the submission instance data fields to the database. Each field is
 * stored as its own row in the database. This approach avoids the need to
 * recreate the form's model schema in this local database.
 *
 * @param  {Object}   formId          [description]
 * @param  {Object} submissionData    [description]
 * @param  {Object}   tran            Sequelize transaction
 * @return {Promise}                  [description]
 */
PublishClient.prototype._saveFieldData = function(formId, fieldsData, instanceId, tran) {
  log.debug('Saving FIELD DATA from submission', fieldsData);
  var FieldDataModel = this.dbClient.SubmissionData;

  return FieldDataModel.findOne({where: {instanceId: instanceId}, transaction: tran})
  .then(function(result) {
    // Only insert the field data when the instance id (i.e., form submission)
    // is not already present in the submission data table.
    if (!result) {
      log.debug('Inserting field data');
      return FieldDataModel.bulkCreate(fieldsData, {transaction: tran});
    }
    log.debug('Skipping insert for existing field data');
  });
};

module.exports = PublishClient;
