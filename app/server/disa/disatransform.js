'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const xmlBuilder = new xml2js.Builder({renderOpts: {pretty: false}});
const log = require('app/server/util/logapp.js');
const string = require('app/common/string.js');
const datatransform = require('app/server/util/datatransform.js');
const datamerge = require('app/server/util/datamerge.js');
const firstText = datatransform.firstText;

// TODO: Define new typedefs for lab status objects

/**
 * @typedef {LabTest}
 * @property {!string} labstatus [description]
 * @property {!string} labtest [description]
 * @property {?string} labreject [description]
 */

/**
 * @typedef {LabStatus}
 * @property {string} stid The STT ID
 * @property {string} labid The Disa Labs ID
 * @property {string} labtime The timestamp of the submission in ISO 8601 format
 * @property {Array.<LabTest>} srepeat The laboratory test request updates
 */

/**
 * Enum for Disa Labs sampleId status updates
 * @enum {string}
 */
const commonFields = {
  STATUS: 'LabStatus',
  ST_ID: 'STID',
  LAB_ID: 'LabID',
  STATUS_TIME: 'StatusTimestamp',
  LAB_PREFIX: 'LabPrefix',
  LAB_PREFIX_CODE: 'LabPrefixCode',
  UPDATES: 'SampleTest',
  DESCRIPTION: 'Description'
};

/**
 * Enum for Disa Labs sampleId status test requests
 * @enum {string}
 */
const testFields = {
  STATUS_ELEM: 'Status',
  STATUS_CODE: 'StatusCode',
  TEST_ELEM: 'Test',
  TEST_CODE: 'TestCode',
  REJECTION_ELEM: 'Rejection',
  REJECTION_CODE: 'RejectionCode'
};

function labStatusDate(status) {
  return string.parseText(firstText(status, commonFields.STATUS_TIME));
}

function sampleId(status) {
  return BPromise.props({
    stId: firstText(status, commonFields.ST_ID),
    labId: firstText(status, commonFields.LAB_ID)
  });
}

const LAB_ID_REGEX = /([a-zA-Z]{3})([0-9]{7})/;
const LAB_PREFIX_CODE_PATH = [
  commonFields.LAB_PREFIX, '0', commonFields.LAB_PREFIX_CODE, '0'
];

/**
 * Disa Labs Lab Ids are 10 character strings. The first 3 characters represent
 * the lab prefix code, an identifier for the lab facility itself. The remainig
 * 10 numeric characters complete the labId.
 *
 * @param {!Object} options [description]
 * @param {!Object} options.status [description]
 * @param  {!string} options.labId [description]
 * @return {string}
 * @throws {Error} If [labId does not match pattern /([a-zA-Z]{3})([0-9]{7})/]
 */
const labPrefix = BPromise.method(function(options) {
  const result = options.labId.match(LAB_ID_REGEX);
  if (result === null) {
    throw new Error('unrecognized pattern for ' + commonFields.LAB_ID);
  }

  const labPrefixText = _.get(options.status, LAB_PREFIX_CODE_PATH);
  if (labPrefixText !== result[1]) {
    // TODO: Is is an error? Maybe a sampleId can move between different labs
    log.warn(`LabId lab prefix ${result[1]} does not match LabPrefix
             ${labPrefixText}`);
  }

  return labPrefixText;
});

// Path to codes from a LabStatus element
const LAB_TEST_CODE_PATH = [
  testFields.TEST_ELEM, '0', testFields.TEST_CODE, '0'
];
const LAB_REJECT_CODE_PATH = [
  testFields.REJECTION_ELEM, '0', testFields.REJECTION_CODE, '0'
];
const LAB_STATUS_CODE_PATH = [
  testFields.STATUS_ELEM, '0', testFields.STATUS_CODE, '0'
];

/**
 * Pulls the status code, test code, and rejection code from one group of
 * status updates.
 *
 * @param  {Object} change [description]
 * @return {Promise.<Object>}        [description]
 */
function getOneChange(change) {
  return BPromise.props({
    status: _.get(change, LAB_STATUS_CODE_PATH),
    labTestType: _.get(change, LAB_TEST_CODE_PATH),
    labRejection: _.get(change, LAB_REJECT_CODE_PATH) || null
  });
}

const CHANGE_STAGE = 'labstatus';

/**
 * Pulls an Array of status updates from the parsed object.
 *
 * @param  {Object} status [description]
 * @return {Promise.<Array.<Object>>}
 */
function labChanges(status) {
  const commonProps = BPromise.props({
    facility: labPrefix({
      status, labId: firstText(status, commonFields.LAB_ID)
    }),
    statusDate: labStatusDate(status),
    stage: CHANGE_STAGE
  });

  const changes = BPromise.map(
    status[commonFields.UPDATES],
    getOneChange
  );

  return BPromise.join(commonProps, changes, (common, changes) =>
    BPromise.map(changes, change => Object.assign({}, common, change))
  );
}

const testTypeRefs = BPromise.method((testType, testMap) => {
  const labTestRef = testMap[testType] ? testMap[testType].uuid : null;
  if (!labTestRef) {
    throw new Error(`Missing lab test reference for test type "${testType}"`);
  }
  return {labTest: labTestRef};
});

/**
 * Supplements the labTestType values contained in each change with the
 * corresponding labTest value (i.e., LabTest reference/uuid).
 *
 * @param  {Array.<Object>} changes  [description]
 * @param  {Array.<Object>} labTests [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
function fillTestRefs(changes, labTests) {
  return datamerge.propKeyReduce(labTests, ['testType'])
  .then(testMap => {
    return BPromise.map(changes, change => {
      const labTestRef = testTypeRefs(change.labTestType, testMap);
      return labTestRef.then(ref =>
        Object.assign({}, _.omit(change, 'labTestType'), ref)
      );
    });
  });
}

/**
 * [labTests description]
 * @param  {Object} status [description]
 * @return {Promise.<Array.<Object>>}
 */
function labTests(status) {
  return BPromise.map(
    status[commonFields.UPDATES],
    change => BPromise.props({
      testType: _.get(change, LAB_TEST_CODE_PATH)
    })
  )
  .filter(test => test.testType !== '*');
}

const fillSampleIdRefs = BPromise.method((labTests, sampleIdsRef) => {
  if (!sampleIdsRef) {
    throw new Error('Missing required parameter sampleIdsRef');
  }
  return BPromise.map(labTests, test =>
    Object.assign({}, test, {sampleId: sampleIdsRef})
  );
});

// Paths to metadata description elements from a LabStatus element
const DESC_PATH = [commonFields.DESCRIPTION, '0'];
const LAB_PREFIX_DESC_PATH = [commonFields.LAB_PREFIX, '0'].concat(DESC_PATH);
const LAB_STATUS_DESC_PATH = [testFields.STATUS_ELEM, '0'].concat(DESC_PATH);
const LAB_TEST_DESC_PATH = [testFields.TEST_ELEM, '0'].concat(DESC_PATH);
const LAB_REJECT_DESC_PATH = [testFields.REJECTION_ELEM, '0'].concat(DESC_PATH);

/**
 * [metadata description]
 * @param  {Object} status [description]
 * @return {Promise.<Object>}        [description]
 */
function metadata(status) {
  const changes = status[commonFields.UPDATES];

  return BPromise.join(
    datatransform.oneMeta(
      status, 'facility', LAB_PREFIX_CODE_PATH, LAB_PREFIX_DESC_PATH
    ),
    BPromise.map(changes, change =>
      datatransform.oneMeta(
        change, 'status', LAB_STATUS_CODE_PATH, LAB_STATUS_DESC_PATH
      )
    ),
    BPromise.map(changes, change =>
      datatransform.oneMeta(
        change, 'labtest', LAB_TEST_CODE_PATH, LAB_TEST_DESC_PATH
      )
    ).filter(meta => meta.key !== '*'),
    BPromise.map(changes, change =>
      datatransform.oneMeta(
        change, 'rejection',LAB_REJECT_CODE_PATH, LAB_REJECT_DESC_PATH
      )
    )
  )
  .then(_.flatten)
  .filter(item => item !== null);
}

/**
 * Converts a Disa Labs lab status XML document into an Object representing the
 * different entities or models in the STT service.
 *
 * @param  {string} status Disa Labs status XML
 * @return {Promise.<Object>}
 */
function labStatus(xml) {
  log.debug('Transorming Lab Status XML', xml);
  return xml2js.parseStringAsync(xml)
  .then(parsed => parsed[commonFields.STATUS]);
}

/**
 * Returns a new Object with the id attribute, required for ODK Aggregate
 * submissions, included on the object under the `$` property. These `$`
 * properties are translated to an XML attribute by the xml2js builder.
 *
 * The passed object is also nested with a new object, keyed on formId.
 *
 * @param  {Object} obj    [description]
 * @param  {string} formId [description]
 * @return {Object}        [description]
 */
function formIdWrap(obj, formId) {
  var data = Object.assign(obj, {$: {id: formId}});

  var form = {};
  form[formId] = data;
  return form;
}

const LAB_STATUS_FORM_ID = 'labstatus';

/**
 * [buildLabForm description]
 *
 * @param {Object} sampleIds [description]
 * @param {Date} statusDate [description]
 * @param {Array.<Object>} changes [description]
 * @return {string} labstatus form submission XML
 */
function buildLabXForm(sampleIds, statusDate, changes) {
  log.debug('Building lab status submission XML', changes);

  return BPromise.map(changes, change => ({
    labstatus: change.status,
    labtest: change.labTestType,
    labreject: change.labRejection
  }))
  .then(repeats => ({
    stid: sampleIds.stId,
    labid: sampleIds.labId,
    labtime: (
      statusDate && statusDate.toISOString ?
      statusDate.toISOString() :
      ''
    ),
    srepeat: repeats
  }))
  .then(result =>
    xmlBuilder.buildObject(formIdWrap(result, LAB_STATUS_FORM_ID))
  );
}

module.exports = {
  labStatus,
  labStatusDate,
  metadata,
  sampleId,
  labTests,
  labChanges,
  fillTestRefs,
  fillSampleIdRefs,
  buildLabXForm
};
