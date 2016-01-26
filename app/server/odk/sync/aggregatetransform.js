'use strict';

const BPromise = require('bluebird');
const xml2js = require('xml2js');
BPromise.promisifyAll(xml2js);
const log = require('app/server/util/logapp.js');
const string = require('app/common/string.js');

function getElemText(parent, textNode) {
  return parent[textNode] ? parent[textNode][0] : null;
}

/**
 * ODK Aggregate form list XML top-level element names
 * @enum {string}
 */
const formListFields = {
  XFORMS: 'xforms',
  XFORM: 'xform'
};

/**
 * ODK Aggregate form list XML element names for xform element children
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

function parseXForm(xform) {
  return {
    formID: getElemText(xform, xformFields.ID),
    name: getElemText(xform, xformFields.NAME),
    majorMinorVersion: string.parseText(
      getElemText(xform, xformFields.MAJOR_VERSION)
    ),
    version: string.parseText(getElemText(xform, xformFields.VERSION)),
    hash: getElemText(xform, xformFields.HASH),
    downloadUrl: getElemText(xform, xformFields.DOWNLOAD_URL),
    manifestUrl: getElemText(xform, xformFields.MANIFEST_URL)
  };
}

/**
 * [parseFormList description]
 *
 * @param  {string} formList Form list XML
 * @return {Promise.<Array.<Form>>}
 */
function parseFormList(formList) {
  log.debug('Parsing form list XML');

  return xml2js.parseStringAsync(formList)
  .then(parsed => parsed[formListFields.XFORMS][formListFields.XFORM])
  .map(parseXForm);
}

/**
 * Manifest XML element names
 * @enum {string}
 */
const manifestFields = {
  MANFIEST: 'manifest',
  MEDIA_FILE: 'mediaFile',
  FILENAME: 'filename',
  HASH: 'hash',
  DOWNLOAD_URL: 'downloadUrl'
};

/**
 * @typedef {Manifest}
 * @property {string} filename [description]
 * @property {string} hash [description]
 * @property {string} downloadUrl [description]
 */

/**
 * [parseFormManifest description]
 *
 * @param  {string} manifest [description]
 * @return {Promise.<Manifest>}          [description]
 */
function parseFormManifest(manifest) {
  log.debug('Parsing form manifest XML');

  return xml2js.parseStringAsync(manifest)
  .then(parsed => parsed[manifestFields.MANFIEST][manifestFields.MEDIA_FILE])
  .map(media => ({
    filename: getElemText(media, manifestFields.FILENAME),
    hash: getElemText(media, manifestFields.HASH),
    downloadUrl: getElemText(media, manifestFields.DOWNLOAD_URL)
  }));
}

/**
 * @typedef {SubmissionList}
 * @property {Array.<string>} ids Submission IDs
 * @property {string} cursor ODK Aggregate resumption cursor
 */

const submissionListFields = {
  CHUNK: 'idChunk',
  ID_LIST: 'idList',
  ID: 'id',
  CURSOR: 'resumptionCursor'
};

/**
 * [parseSubmissionList description]
 * @param  {string} list [description]
 * @return {Promise.<SubmissionList>}      [description]
 */
function parseSubmissionList(list) {
  log.debug('Parsing form submission list');

  return xml2js.parseStringAsync(list)
  .then(parsed => parsed[submissionListFields.CHUNK])
  .then(parsed => ({
    idList: parsed[submissionListFields.ID_LIST],
    cursor: getElemText(parsed, submissionListFields.CURSOR)
  }))
  .then(result => ({
    ids: result.idList[0][submissionListFields.ID],
    cursor: result.cursor
  }));
}

/**
 * [parseSubmission description]
 * @param  {string} sub [description]
 * @return {Object}     [description]
 */
function parseSubmission(sub) {
  return xml2js.parseStringAsync(sub);
  // TODO: flatten arrays/objects
}

module.exports = {
  parseFormList, parseFormManifest, parseSubmissionList, parseSubmission
};
