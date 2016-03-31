'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const xmlBuilder = new xml2js.Builder({renderOpts: {pretty: false}});
const log = require('app/server/util/logapp.js');
const string = require('app/common/string.js');
const datamerge = require('app/server/util/datamerge.js');
const uuid = require('app/server/util/uuid.js');

// TODO: Define new jsdoc typedefs for lab status objects

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

/**
 * The xml2js XML parser always adds text nodes in an array. Given an object
 * and a property name, this simply returns the first element for the property's
 * Array value, if the property exists and the property contains an Array.
 * Otherwise, this function returns null.
 *
 * @param  {Object} obj   [description]
 * @param  {string} propName [description]
 * @return {string|null}          [description]
 */
const firstText = (obj, propName) => {
  return obj[propName] ? obj[propName][0] : null;
};

const labStatusDate = status => {
  return string.parseText(firstText(status, commonFields.STATUS_TIME));
};

const sampleId = status => {
  return BPromise.props({
    stId: firstText(status, commonFields.ST_ID),
    labId: firstText(status, commonFields.LAB_ID)
  });
};

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
const getOneChange = change => {
  return BPromise.props({
    status: _.get(change, LAB_STATUS_CODE_PATH),
    labTestType: _.get(change, LAB_TEST_CODE_PATH),
    labRejection: _.get(change, LAB_REJECT_CODE_PATH) || null
  });
};

const CHANGE_STAGE = 'LABSTATUS';

/**
 * Pulls an Array of status updates from the parsed object.
 *
 * @param  {Object} status [description]
 * @return {Promise.<Array.<Object>>}
 */
const labChanges = status => {
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
};

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
const fillTestRefs = (changes, labTests) => {
  return datamerge.propKeyReduce({items: labTests, propNames: ['testType']})
  .then(testMap => {
    return BPromise.map(changes, change => {
      const labTestRef = testTypeRefs(change.labTestType, testMap);
      return labTestRef.then(ref =>
        Object.assign({}, _.omit(change, 'labTestType'), ref)
      );
    });
  });
};

/**
 * [labTests description]
 * @param  {Object} status [description]
 * @return {Promise.<Array.<Object>>}
 */
const labTests = status => {
  return BPromise.map(
    status[commonFields.UPDATES],
    change => BPromise.props({
      testType: _.get(change, LAB_TEST_CODE_PATH)
    })
  )
  .filter(test => test.testType !== '*');
};

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
 * Parse a key/value pair object
 * @param  {Object} parentElem [description]
 * @param  {Array.<string|number>} keyPath    [description]
 * @param  {Array.<string|number>} descPath   [description]
 * @return {Object}            [description]
 */
const oneMeta = (parentElem, keyPath, descPath) => {
  const metaKey = _.get(parentElem, keyPath);

  if (metaKey) {
    return {
      key: metaKey.toUpperCase().trim(),
      value: descPath ? _.get(parentElem, descPath, '').trim() : null
    };
  }
  return null;
};

const wrapMetaParse = metaFunc => {
  return submission => metaFunc(submission)
  .filter(meta => meta !== null)
  .then(results => _.uniqBy(results, meta => meta.key));
};

const metaStatuses = wrapMetaParse(submission => {
  const changes = submission[commonFields.UPDATES];
  return BPromise.map(changes, change =>
    oneMeta(change, LAB_STATUS_CODE_PATH, LAB_STATUS_DESC_PATH));
});

const metaFacility = submission => BPromise.resolve(oneMeta(
  submission, LAB_PREFIX_CODE_PATH, LAB_PREFIX_DESC_PATH
));

const metaLabTests = wrapMetaParse(submission => {
  const changes = submission[commonFields.UPDATES];
  return BPromise.map(changes, change =>
    oneMeta(change, LAB_TEST_CODE_PATH, LAB_TEST_DESC_PATH))
  .filter(meta => meta.key !== '*');
});

const metaRejections = wrapMetaParse(submission => {
  const changes = submission[commonFields.UPDATES];
  return BPromise.map(changes, change =>
    oneMeta(change, LAB_REJECT_CODE_PATH, LAB_REJECT_DESC_PATH));
});

/**
 * Converts a Disa Labs lab status XML document into an Object representing the
 * different entities or models in the STT service.
 *
 * @param  {string} status Disa Labs status XML
 * @return {Promise.<Object>}
 */
const labStatus = xml => {
  return xml2js.parseStringAsync(xml)
  .then(parsed => parsed[commonFields.STATUS]);
};

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
const formIdWrap = (obj, formId) => {
  var data = Object.assign(obj, {$: {id: formId}});

  var form = {};
  form[formId] = data;
  return form;
};

const LAB_STATUS_FORM_ID = 'labstatus';

/**
 * [buildLabForm description]
 *
 * @param {Object} sampleIds [description]
 * @param {Date} statusDate [description]
 * @param {Array.<Object>} changes [description]
 * @return {string} labstatus form submission XML
 */
const buildLabXForm = (
  sampleIds, statusDate, changes, metaFacility, date, xml
) => {
  log.debug('Building lab status submission XML', changes);
  const submissionDate = date ? date.toISOString() : '';
  const facility = metaFacility.key;

  const meta = uuid.uuidV5(xml)
  .then(hash => ({instanceID: `uuid:${hash}`}));

  return BPromise.map(changes, change => ({
    labstatus: change.status,
    labtest: change.labTestType,
    labreject: change.labRejection
  }))
  .then(repeats => BPromise.props({
    end: submissionDate,
    facility,
    stid: sampleIds.stId,
    labid: sampleIds.labId,
    labtime: (
      statusDate && statusDate.toISOString ?
      statusDate.toISOString() :
      ''
    ),
    srepeat: repeats,
    rawxml: xml,
    meta
  }))
  .then(result =>
    xmlBuilder.buildObject(formIdWrap(result, LAB_STATUS_FORM_ID))
  );
};

module.exports = {
  labStatus,
  labStatusDate,
  metaStatuses,
  metaFacility,
  metaLabTests,
  metaRejections,
  sampleId,
  labTests,
  labChanges,
  fillTestRefs,
  fillSampleIdRefs,
  buildLabXForm
};
