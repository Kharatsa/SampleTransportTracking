'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');

/** @module publiser/publishtransform */

function maybeParseDate(value) {
  if (value) {
    var tmp = new Date();
    tmp.setTime(Date.parse(value));
    if (Number.isNaN(tmp)) {
      return value;
    }
    return tmp;
  }
  return value;
}

/**
 * Enum for ODK Aggregate form fields relevant to samples
 * @enum {string}
 */
const sampleFields = {
  SAMPLE_REPEAT: 'srepeat',
  SAMPLE_TRACKING_ID: 'stid',
  LAB_ID: 'labid',
  TYPE: 'stype'
};

/**
 * Parses the sample details from a form submission
 *
 * @param  {Object} data - The published form submission
 * @return {Promise.<Sample>}
 */
function parseSamples(data) {
  log.debug('Parse samples');

  var sampleData = data[sampleFields.SAMPLE_REPEAT];
  var parsedByStId = {};

  return BPromise.map(sampleData, sample => {
    var item = {
      stId: sample[sampleFields.SAMPLE_TRACKING_ID] || null,
      labId: sample[sampleFields.LAB_ID] || null,
      type: sample[sampleFields.TYPE] || null//,
      // repeatCount: 1
    };

    // Each unique stId should appear only 1x in the results array
    var sameSample = parsedByStId[item.stId];
    if (typeof sameSample === 'undefined') {
      parsedByStId[item.stId] = item;
      return item;
    }
    // TODO: throw an error if stId/labId doesn't match for all records?
    // sameSample.repeatCount += 1;
    return null;
  })
  .filter(sample => sample !== null);
}

/**
 * Enum for ODK Aggregate form fields relevant to updates
 * @enum {string}
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

/**
 * Parses the submissin/form level fields from the published data.
 *
 * @param  {!string} formId - The form Id
 * @param  {Object} data - The published form submission
 * @return {Submission}
 */
function parseSubmission(formId, data) {
  log.debug('Parse submission');

  return {
    form: formId,
    submissionId: data[submissionFields.SUBMISSION_ID],
    facility: data[submissionFields.FACILITY] || null,
    person: data[submissionFields.PERSON] || null,
    deviceId: data[submissionFields.DEVICE_ID] || null,
    simSerial: data[submissionFields.SIM_SERIAL] || null,
    formStartDate: (maybeParseDate(
      data[submissionFields.FORM_START_DATE]
    ) || null),
    formEndDate: (maybeParseDate(
        data[submissionFields.FORM_END_DATE]
      ) || null),
    completedDate: (maybeParseDate(
        data[submissionFields.COMPLETED_DATE]
      ) || null)
  };
}

/**
 * Enum for ODK Aggregate form fields relevant to facilities
 * @enum {string}
 */
const facilityFields = {
  REGION: 'region',
  FACILITY: 'facility',
  TYPE: 'ftype'
};

/**
 * Parses the facility details from a form submission
 *
 * @param  {Object} data - The published form submission
 * @return {Facility}      [description]
 */
function parseFacility(data) {
  log.debug('Parse facility');

  var facilityKey = data[facilityFields.FACILITY];
  if (facilityKey) {
    return {
      name: data[facilityFields.FACILITY],
      region: data[facilityFields.REGION],
      type: data[facilityFields.TYPE] || null
    };
  }
  return null;
}

/**
 * Enum for ODK Aggregate form fields relevant to people
 * @enum {string}
 */
const personFields = {
  PERSON: 'person'
};

/**
 * Parses the person details from a form submission
 *
 * @param  {Object} data - The published form submission
 * @return {Person}
 */
function parsePerson(data) {
  log.debug('Parse person');

  var personKey = data[personFields.PERSON];
  if (personKey) {
    return {name: personKey};
  }
  return null;
}

/**
 * Enum for ODK Aggregate form fields relevant to data storage
 * @enum {string}
 */
const updatesFields = {
  SUBMISSION_ID: 'instanceID',
  SAMPLE_REPEAT: 'srepeat',
  ST_ID: 'stid',
  LAB_ID: 'labid',
  STATUS: 'condition'
};

/**
 * Transforms the submission data object into an array of objects. Each array
 * value contains one field and value pair.
 *
 * @param  {Object} data - The published form submission
 * @return {Promise.<Array.<Update>>}
 */
function parseUpdates(data) {
  log.debug('Parsing updates');

  var repeats = data[updatesFields.SAMPLE_REPEAT];
  var updateByStId = {};
  var updateCount = 0;

  return BPromise.map(repeats, entry => {
    var item = {
      submissionId: data[updatesFields.SUBMISSION_ID],
      submissionNumber: null,
      stId: entry[updatesFields.ST_ID] || null,
      labId: entry[updatesFields.LAB_ID] || null,
      sampleUpdatesCount: 1,
      sampleStatus: entry[updatesFields.STATUS] || null
    };

    // Each unique stId should appear only 1x in the results array
    var sameSample = updateByStId[item.stId];
    if (typeof sameSample === 'undefined') {
      updateCount += 1;
      item.submissionNumber = updateCount;
      updateByStId[item.stId] = item;
      return item;
    }
    sameSample.sampleUpdatesCount += 1;
    // TODO: throw an error on inconsist status values?
    sameSample.sampleStatus = item.sampleStatus;
    return null;
  })
  .filter(update => update !== null);
}

/**
 * Enum for ODK Aggregate form fields relevant to data storage
 * @enum {string}
 */
const testFields = {
  SUBMISSION_ID: 'instanceID',
  LAB_REPEAT: 'srepeat',
  ST_ID: 'stid',
  LAB_ID: 'labid',
  LAB_STATUS: 'labstatus',
  LAB_TEST: 'labtest',
  LAB_REJECT: 'labreject'
};

const LAB_STATUS_FORMID = 'labstatus';

/**
 * [parseTestRequests description]
 *
 * @param {!string} formId [description]
 * @param  {!Object} data [description]
 * @return {Promise.<Array.<TestRequest>>}      [description]
 */
function parseTestRequests(formId, data) {
  if (formId === LAB_STATUS_FORMID) {
    log.debug('Parsing test requests');

    var repeats = data[updatesFields.SAMPLE_REPEAT];
    return BPromise.map(repeats, entry => ({
      submissionId: data[updatesFields.SUBMISSION_ID],
      stId: entry[updatesFields.ST_ID] || null,
      labId: entry[updatesFields.LAB_ID] || null,
      statusCode: entry[testFields.LAB_STATUS],
      testCode: entry[testFields.LAB_TEST],
      rejectCode: entry[testFields.LAB_REJECT]
    }));
  }
  log.debug('Skipping parse test request');
  return BPromise.resolve([]);
}

/**
 * A form submission generated by ODK Aggregate's simple JSON publisher.
 *
 * @typedef Published
 * @property {string} token - The publisher auth token
 * @property {string} content -
 * @property {formId} formId - The source ODK form identifier
 * @property {formVersion} formVersion -
 * @property {Array} data - The content or body of the form submission. This
 *                        array may include 1 or more separate form submissions.
 */

/**
 * The published data, transformed into Sample Tracking objects.
 *
 * @typedef {Object} PublishTransformed
 * @property {Sample} samples - The sample Ids
 * @property {Submission} submission - [description]
 * @property {Facility} facility - [description]
 * @property {Person} person - [description]
 * @property {Update} update - [description]
 */

/**
 * Enum for ODK Aggregate form-level fields
 * @enum {string}
 */
const formFields = {
  FORM_ID: 'formId'
};

/**
 * Reshapes data from the JSON generated by the ODK Aggregate publishers to fit
 * the local application's data models.
 *
 * @param  {Published} published   ODK Aggregate form submission as "simple JSON"
 * @return {Array.<PublishTransformed>}
 */
const parsePublished = function(published) {
  log.info('Parsing aggregate publish data', published);

  var formId = published[formFields.FORM_ID];
  return BPromise.map(published.data, submission =>
    BPromise.props({
      samples: parseSamples(submission),
      submission: parseSubmission(formId, submission),
      facility: parseFacility(submission),
      person: parsePerson(submission),
      updates: parseUpdates(submission)
    })
    .then(transformed =>
      parseTestRequests(formId, submission, transformed.updates)
      .then(tests => {
        transformed.tests = tests;
        return transformed;
      })
    )
  );
};

module.exports = parsePublished;
