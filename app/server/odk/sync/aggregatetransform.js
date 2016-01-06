'use strict';

const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const parse = require('app/common/parse.js');

function getElemText(parent, textNode) {
  return parent[textNode] ? parent[textNode][0] : null;
}

/**
 * Enum for ODK Aggregate Form List fields
 * @enum {string}
 */
const formListFields = {
  XFORMS: 'xforms',
  XFORM: 'xform'
};

/**
 * Enum for ODK Aggregate form-level fields
 * @enum {string}
 */
const xformFields = {
  ID: 'formID',
  NAME: 'name',
  MAJOR_VERSION: 'majorMinorVersion',
  VERSION: 'version',
  HASH: 'hash',
  DOWNLOAD_URL: 'downloadUrl',
  MANIFEST_URL: 'manifestUrl'
};

/**
 * [parseFormList description]
 *
 * @param  {string} formList Form list XML
 * @return {Promise.<Array.<Form>>}
 */
function parseFormList(formList) {
  return xml2js.parseStringAsync(formList)
  .then(parsed => parsed[formListFields.XFORMS][formListFields.XFORM])
  .map(xform => ({
    formId: getElemText(xform, xformFields.ID),
    formName: getElemText(xform, xformFields.NAME),
    majorMinorVersion: parse.parseText(
      getElemText(xform, xformFields.MAJOR_VERSION)
    ),
    version: parse.parseText(getElemText(xform, xformFields.VERSION)),
    hash: getElemText(xform, xformFields.HASH),
    downloadUrl: getElemText(xform, xformFields.DOWNLOAD_URL),
    manifestUrl: getElemText(xform, xformFields.MANIFEST_URL)
  }));
}

module.exports = {
  parseFormList
};
