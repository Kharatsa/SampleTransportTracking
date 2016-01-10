'use strict';

const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const xmlBuilder = new xml2js.Builder({renderOpts: {pretty: false}});
const log = require('app/server/util/log.js');
const parse = require('app/common/parse.js');

function getElemText(parent, textNode) {
  return parent[textNode] ? parent[textNode][0] : null;
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

/**
 * @typedef {LabTest}
 * @property {!string} labstatus [description]
 * @property {!string} labtest [description]
 * @property {?string} labreject [description]
 */

/**
 * @typedef {LabStatus}
 * @property {string} stid The Sample Tracking ID for the sample
 * @property {string} labid The Disa Labs ID for the sample
 * @property {string} labtime The timestamp of the submission in ISO 8601 format
 * @property {Array.<LabTest>} srepeat The laboratory test request updates
 */

/**
 * Enum for Disa Labs sample status updates
 * @enum {string}
 */
const labStatusFields = {
  STATUS: 'LabStatus',
  LAB_ID: 'LabID',
  ST_ID: 'STID',
  STATUS_TIME: 'StatusTimestamp',
  TEST_REQUEST: 'SampleTest'
};

/**
 * Enum for Disa Labs sample status test requests
 * @enum {string}
 */
const testRequestFields = {
  STATUS: 'StatusCode',
  TEST: 'TestCode',
  REJECTION: 'RejectionCode'
};

/**
 * [translateParsed description]
 * @param  {[type]} parsed [description]
 * @return {[type]}        [description]
 */
function parsedToLabStatus(parsed) {
  return BPromise.props({
    stid: getElemText(parsed, labStatusFields.ST_ID),
    labid: getElemText(parsed, labStatusFields.LAB_ID),
    labtime: parse.parseText(
      getElemText(parsed, labStatusFields.STATUS_TIME)
    ).toISOString(),
    srepeat: BPromise.map(parsed[labStatusFields.TEST_REQUEST], request => ({
      labstatus: getElemText(request, testRequestFields.STATUS),
      labtest: getElemText(request, testRequestFields.TEST),
      labreject: getElemText(request, testRequestFields.REJECTION)
    }))
  });
}

/**
 * [parseLabStatus description]
 * @param  {string} status Disa Labs status XML
 * @return {Promise.<LabStatus>}
 */
function parseLabStatus(xml) {
  log.debug('lab status XML', xml);

  return xml2js.parseStringAsync(xml)
  .then(parsed => parsed[labStatusFields.STATUS])
  .then(parsedToLabStatus);
}

const LAB_STATUS_FORM_ID = 'labstatus';

/**
 * [buildLabForm description]
 *
 * @param  {LabStatus} labStatus [description]
 * @return {string} labstatus form submission XML
 */
function buildLabForm(labStatus) {
  log.debug('Building lab status submission XML', labStatus);
  return xmlBuilder.buildObject(formIdWrap(labStatus, LAB_STATUS_FORM_ID));
}

const metadataFields = {
  META: 'Meta',
  CHANGED_TIME: 'ChangedTimestamp',
  ADD: 'Add',
  REMOVE: 'Remove',
  UPDATE: 'Update',
  TYPE: 'Type',
  KEY: 'Key',
  DETAIL: 'Detail'
};

function makeMetaAction(action, item, actionDate) {
  return {
    action,
    actionDate,
    type: getElemText(item, metadataFields.TYPE),
    key: getElemText(item, metadataFields.KEY),
    detail: getElemText(item, metadataFields.DETAIL)
  };
}

/**
 * [parseMetadataUpdate description]
 *
 * @param  {string} update Metadata update XML
 * @return {[type]}        [description]
 */
function parseMetadataUpdate(xml) {
  log.debug('Parsing metadata update XML');

  return xml2js.parseStringAsync(xml)
  .then(parsed => parsed[metadataFields.META])
  .then(parsed => {
    var actionDate = parse.parseText(
      getElemText(parsed, metadataFields.CHANGED_TIME)
    ).toISOString();

    return BPromise.props({
      adds: BPromise.map(parsed[metadataFields.ADD] || [], item => {
        return makeMetaAction('add', item, actionDate);
      }),
      removes: BPromise.map(parsed[metadataFields.REMOVE] || [], item => {
        return makeMetaAction('remove', item, actionDate);
      }),
      updates: BPromise.map(parsed[metadataFields.UPDATE] || [], item => {
        return makeMetaAction('update', item, actionDate);
      })
    });
  })
  .then(result => [].concat(
    result.adds, result.removes, result.updates
  ));
}

/**
 * @typedef {MetadataUpdate}
 * @property {string} action [description]
 * @property {string} type [description]
 * @property {string} key [description]
 * @property {string} detail [description]
 */

const METADATA_FORM_ID = 'stt_metadata';

/**
 * [buildMetadataForm description]
 *
 * @param  {MetadataUpdate} metaUpdate [description]
 * @return {string} stt_metadata form submission XML
 */
function buildMetadataForm(meta) {
  log.debug('Building metadata form submission XML', meta);
  return xmlBuilder.buildObject(formIdWrap(meta, METADATA_FORM_ID));
}

module.exports = {
  parseLabStatus,
  buildLabForm,
  parseMetadataUpdate,
  buildMetadataForm
};
