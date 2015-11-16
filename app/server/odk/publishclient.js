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
  SAMPLE_DEPARTURE: 'sdepart',
  SAMPLE_ARRIVAL: 'sarrive',
  LAB_LINK: 'link',
  RESULT: 'result',
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
 * Enum for ODK Aggregate form fields relevant to samples
 * @enum {String}
 */
const sampleFields = {
  SAMPLE_REPEAT: 'srepeat',
  SAMPLE_TRACKING_ID: 'stid',
  LAB_ID: 'labid',
  TYPE: 'stype',
};

function parseSamples(data) {
  log.debug('parseSamples', data);
  var sampleData = data[sampleFields.SAMPLE_REPEAT];

  return BPromise.map(sampleData, function(sample) {
    return {
      stId: sample[sampleFields.SAMPLE_TRACKING_ID] || null,
      labId: sample[sampleFields.LAB_ID] || null,
      type: sample[sampleFields.TYPE] || null,
    };
  });
}

/**
 * Enum for ODK Aggregate form fields relevant to facilities
 * @enum {String}
 */
const facilityFields = {
  REGION: 'region',
  FACILITY: 'facility',
  TYPE: 'ftype',
};

function parseFacility(data) {
  log.debug('parseFacility', data);
  return {
    name: data[facilityFields.FACILITY],
    region: data[facilityFields.REGION],
    type: data[facilityFields.TYPE] || null,
  };
}

/**
 * Enum for ODK Aggregate form fields relevant to events
 * @enum {String}
 */
const submissionFields = {
  SUBMISSION_ID: 'instanceID',
  PERSON: 'person',
  FACILITY: 'facility',
  SIM_SERIAL: 'simserial',
  DEVICE_ID: 'deviceid',
  FORM_START_DATE: 'start',
  FORM_END_DATE: 'end',
  COMPLETED_DATE: '*meta-date-marked-as-complete*'
};

function parseSubmission(formId, data) {
  log.debug('parseSubmission', formId, data);
  return {
    form: formId,
    submissionId: data[submissionFields.SUBMISSION_ID],
    facility: data[submissionFields.FACILITY],
    person: data[submissionFields.PERSON],
    deviceId: data[submissionFields.DEVICE_ID],
    simSerial: data[submissionFields.SIM_SERIAL],
    formStartDate: data[submissionFields.FORM_START_DATE],
    formEndDate: data[submissionFields.FORM_END_DATE],
    completedDate: data[submissionFields.COMPLETED_DATE]
  };
}

/**
 * Enum for ODK Aggregate form fields relevant to data storage
 * @enum {String}
 */
const trackerEventsFields = {
  SUBMISSION_ID: 'instanceID',
  INSTANCE_ID: 'instanceID',
  SAMPLE_REPEAT: 'srepeat',
  ST_ID: 'stid',
  LAB_ID: 'labid',
  STATUS: 'condition'
};

/**
 * Transforms the submission data object into an array of objects. Each array
 * value contains one field and value pair.
 *
 * @param  {String} formId
 * @param  {Object} data
 * @return {Object[]}
 */
function parseTrackerEvents(data) {
  log.debug('parseTrackerEvents', data);
  var sampleData = data[trackerEventsFields.SAMPLE_REPEAT];
  log.debug('parseTrackerEvents sampleData', sampleData);
  return BPromise.map(sampleData, function(item) {
    return {
      submissionId: data[trackerEventsFields.SUBMISSION_ID],
      stId: item[trackerEventsFields.ST_ID] || null,
      labId: item[trackerEventsFields.LAB_ID] || null,
      sampleStatus: item[trackerEventsFields.STATUS] || null,
    };
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
 *   * Samples (sample and lab IDs, sample type)
 *   * Submission (form Id, instance/submission Id)
 *   * TrackerEvents
 *   * Facilities
 *
 * @param  {Object} submission  A form submission from ODK Aggregate's Simple
 *                              JSON publisher.
 * @return {Promise}            Resolved when the data is all committed to the
 *                                       database, and otherwise rejected.
 */
PublishClient.prototype.save = function(submission) {
  var formId = submission[formFields.FORM_ID];
  log.info('New `' + formId + '` form submission', submission);
  log.debug('Data', submission.data);

  var self = this;
  return this.dbClient.db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, function(tran) {
    log.debug('Opening new transaction');
    return BPromise.map(submission.data, function(entry) {
      log.debug('ENTRY', entry);
      return BPromise.props({
        samples: parseSamples(entry),
        submission: parseSubmission(formId, entry),
        facility: parseFacility(entry),
        trackerEvents: parseTrackerEvents(entry),
      });
    })
    .each(function(parsed, index, len) {
      log.debug('PublishClient parsed result ' + (index + 1) + ' of ' + len);
      log.debug(parsed);
      return self._saveFacility(parsed.facility, tran)
      .then(function(results) {
        log.debug('PublishClient completed facility insert');
        return self._saveSubmission(formId, parsed.submission, tran);
      })
      .then(function(result) {
        log.debug('PublishClient completed submission insert');
        return self._saveSamples(parsed.samples, tran);
      })
      .then(function(results) {
        var submissionId = parsed.submission.submissionId || null;
        log.debug('PublishClient completed samples insert');
        return self._saveEvents(submissionId, parsed.trackerEvents, tran);
      })
      .then(function() {
        log.debug('PublishClient completed events insert');
        log.debug('PublishClient finished result ' + (index + 1) + ' of ' + len);
      })
    });
  })
  .then(function(result) {
    log.info('Finished COMMITTING form complete submission', result);
  });
};

// TODO: refactor
var maybeUpdateSamples = BPromise.method(function(newId, localId, tran) {
  log.info('Maybe update local Sample', localId.get({plain: true}));

  if (localId.stId !== newId.stId || localId.labId !== newId.labId) {
    log.info('Updating Sample');
    localId.stId = newId.stId;
    localId.labId = newId.labId;
    return localId.save({
      transaction: tran
    });
  } else {
    log.info('Sample does not require update');
  }
  return localId;
});

/**
 * Persists the sample identifiers to the database. Submission data should
 * always include at least one sample ID field. Some forms may include only one
 * sample ID, while others might include all.
 *
 * @param  {Object} samples              A single parsed object parsed from
 *                                        submission data containing the sample
 *                                        ID values (i.e., the samples object
 *                                        may contain 1 or more "ids" that can
 *                                        identify a sample.
 * @param  {Object}   tran                Sequelize transaction
 * @return {Promise.<Instance, created>}  Whether the row was created or updated.
 */
PublishClient.prototype._saveSamples = function(samples, tran) {
  log.info('Saving ' + samples.length + ' submission SAMPLES', samples);
  var SamplesModel = this.dbClient.Samples;

  return BPromise.map(samples, function(sample) {
    return SamplesModel.findOrCreate({
      where: {$or: [
        {$and: [{stId: sample.stId}, {stId: {ne: null}}]},
        {$and: [{labId: sample.labId}, {labId: {ne: null}}]}
      ]},
      defaults: sample,
      transaction: tran
    })
    .then(function(result) {
      var samplesInstance = result[0]
      var created = result[1];
      if (!created) {
        // The sample record already existed. It might require an update.
        return maybeUpdateSamples(sample, samplesInstance, tran);
      }
      log.info('Created new Sample', samplesInstance.get({plain: true}));
    });
  });
};

/**
 * TODO
 *
 * @param  {[type]} facility [description]
 * @param  {[type]} tran     [description]
 * @return {[type]}          [description]
 */
PublishClient.prototype._saveFacility = function(facility, tran) {
  log.info('Saving FACILITY from submission', facility);

  var FacilitiesModel = this.dbClient.Facilities;

  return FacilitiesModel.findOrCreate({
    where: {name: facility.name},
    defaults: facility,
    transaction: tran
  })
  .spread(function(instance, created) {
    if (created) {
      log.debug('Created new facility');
    } else {
      log.debug('Skipping facility insert');
    }
  });
}

PublishClient.prototype._saveSubmission = function(formId, submission, tran) {
  log.debug('Saving form submission', submission);

  var SubmissionsModel = this.dbClient.Submissions;
  return SubmissionsModel.findOrCreate({
    where: {$and: [
      {submissionId: submission.submissionId},
      {submissionId: {ne: null}},
    ]},
    defaults: submission,
    transaction: tran
  });
};


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
PublishClient.prototype._saveEvents = function(submissionId, updates, tran) {
  log.info('Saving EVENTS from submission', updates);

  var TrackerEventModel = this.dbClient.TrackerEvents;

  return TrackerEventModel.findOne({
    where: {$and: [
      {submissionId: submissionId},
      {submissionId: {ne: null}},
    ]},
    transaction: tran
  })
  .then(function(result) {
    // Only insert the field data when the instance id (i.e., form submission)
    // is not already present in the submission data table.
    if (!result) {
      log.debug('Inserting sample events');
      return TrackerEventModel.bulkCreate(updates, {transaction: tran});
    }
    log.debug('Skipping insert for existing sample events');
  });
};

module.exports = PublishClient;
