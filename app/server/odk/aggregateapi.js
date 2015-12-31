'use strict';

const BPromise = require('bluebird');
const request = require('request');
const log = require('app/server/util/log.js');
const aggregateConfig = require('app/config').odk.aggregate;

/**
 * This module replicates the pull functions of the Briefcase Aggregate API.
 *
 * https://github.com/opendatakit/opendatakit/wiki/Briefcase-Aggregate-API
 */

/**
 * Headers required by the OpenRosa API.
 * https://bitbucket.org/javarosa/javarosa/wiki/OpenRosaRequest
 *
 * @const
 * @type {Object}
 */
const OPEN_ROSA_HEADERS = {
  'Accept-Language': 'en',
  'X-OpenRosa-Version': '1.0'
};

/**
 * Authentication object for requests to ODK. The sendImmediately attribute
 * is required to communicate to ODK using HTTP's digest authentication. Digest
 * authentication is required by the OpenRosa API.
 * https://bitbucket.org/javarosa/javarosa/wiki/AuthenticationAPI
 *
 * @const
 * @type {Object}
 */
const ODK_REQUEST_AUTH = {
  user: aggregateConfig.USERNAME,
  pass: aggregateConfig.PASSWORD,
  sendImmediately: false
};

const odkRequest = request.defaults({
  baseUrl: aggregateConfig.URL,
  headers: OPEN_ROSA_HEADERS,
  auth: ODK_REQUEST_AUTH,
  gzip: true,
  time: true
});

var odkRequestGetAsync = BPromise.promisify(odkRequest.get, {multiArgs: true});

/**
 * Fetches a list of forms from ODK Aggregate
 *
 * @return {Promise.<Object,string>}   An http.IncomingMessage object and the
 *                                        text/xml response from ODK
 */
var formList = function formListFunc() {
  log.debug('ODK formlist request');
  return odkRequestGetAsync('/formList');
};

/**
 * Fetches the submission list for a single ODK Aggregate form
 *
 * @param  {string}   formId        A formID from ODK. This value should appear as
 *                                  the text content in a <xform><formID> on the
 *                                  /formList ODK endpoint
 * @param  {number}   [entries]     (optional) Limits the number of submissions
 *                                  returned.
 * @return {Promise.<Object,string>} An http.IncomingMessage object and the
 *                                      text/xml response from ODK
 */
var submissionList = function submissionListFunc(formId, entries) {
  log.debug('ODK /view/submissionList formId=' + formId +
            ' entries=' + entries);
  return odkRequestGetAsync({
    url: '/view/submissionList',
    qs: {formId: formId, numEntries: entries || null}
  });
};

/**
 * Fetches the data for a single ODK Aggregate form submission.
 *
 * http://odk.kharatsa.com/view/downloadSubmission?formId=sample-origin[@version=null%20and%20@uiVersion=null]/sample-origin[@key=uuid:5b6d9e64-e721-42d7-88d4-b3fe62ec2ec1]
 *
 * @param  {string} formId            The ODK formID for the submission.
 * @param  {string} topElement        Name of the top-level element in the
 *                                    form submission. This is the element
 *                                    within the instance element of the model
 *                                    that has the id attribute identifying the
 *                                    formid. The formID is reused in most cases
 *                                    as the topElement.
 * @param  {string} submissionId      The value of the id returned by the
 *                                    view/submissionList API
 * @return {Promise.<Object,string>}  An http.IncomingMessage object and the
 *                                      text/xml response from ODK
 */
var downloadSubmission = function downloadFunc(formId, topElement,
                                               submissionId) {
  var query = formId + '[@version=null and @uiVersion=null]/' +
    topElement + '[@key=' +
    submissionId + ']';
  log.debug('downloadSubmission query:\n\t%s', query);

  return odkRequestGetAsync({
    url: '/view/downloadSubmission',
    qs: {formId: query}
  });
};

module.exports = {
  formList: formList,
  submissionList: submissionList,
  downloadSubmission: downloadSubmission
};
