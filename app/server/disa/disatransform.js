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
 * @param  {LabStatus} labStatus [description]
 * @return {[type]}           [description]
 */
function buildLabForm(labStatus) {
  log.debug('Converting lab status object to ODK submission XML', labStatus);
  // Include ODK's required `id` attribute on the data element
  var formData = Object.assign(labStatus, {
    $: {id: LAB_STATUS_FORM_ID}
  });

  var obj = {};
  obj[LAB_STATUS_FORM_ID] = formData;
  return xmlBuilder.buildObject(obj);
}

module.exports = {
  parseLabStatus, buildLabForm
};
