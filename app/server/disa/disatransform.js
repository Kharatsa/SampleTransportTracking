'use strict';

const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
// const xmlBuilder = new xml2js.Builder();
const parse = require('app/common/parse.js');

function getElemText(parent, textNode) {
  return parent[textNode] ? parent[textNode][0] : null;
}

/**
 * @typedef {LabStatus}
 * @property {[type]} [propName] [description]
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
 * [parseLabStatus description]
 * @param  {string} status Disa Labs status XML
 * @return {Promise.<LabStatus>}
 */
function parseLabStatus(xml) {
  console.log('lab status XML', xml);
  return xml2js.parseStringAsync(xml)
  .then(parsed => parsed[labStatusFields.STATUS])
  .then(parsed =>
    BPromise.props({
      labId: getElemText(parsed, labStatusFields.LAB_ID),
      stId: getElemText(parsed, labStatusFields.ST_ID),
      statusTime: parse.parseText(getElemText(parsed, labStatusFields.STATUS_TIME)),
      tests: BPromise.map(parsed[labStatusFields.TEST_REQUEST], request => ({
        statusCode: getElemText(request, testRequestFields.STATUS),
        testCode: getElemText(request, testRequestFields.TEST),
        rejectCode: getElemText(request, testRequestFields.REJECTION)
      }))
    })
  );
}

module.exports = {
  parseLabStatus
};
