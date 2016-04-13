'use strict';

const BPromise = require('bluebird');
const request = require('request');
const FormData = require('form-data');
const Auth = require('request/lib/auth').Auth;
const config = require('config');
const log = require('server/util/logapp.js');

/**
 * This module replicates the pull functions of the Briefcase Aggregate API.
 *
 * https://github.com/opendatakit/opendatakit/wiki/Briefcase-Aggregate-API
 */

// TODO: re-add authentication to these routes

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

function setOpenRosaHeaders(req, res, next) {
  Object.keys(OPEN_ROSA_HEADERS).forEach(head =>
    res.append(head, OPEN_ROSA_HEADERS[head])
  );
  next();
}

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
  user: config.odk.USERNAME,
  pass: config.odk.PASSWORD,
  sendImmediately: false
};

const ODK_REQUEST_OPTIONS = {
  baseUrl: config.odk.URL,
  headers: OPEN_ROSA_HEADERS,
  gzip: true,
  time: true
};

const ODK_AUTH_REQUEST_OPTIONS = Object.assign({}, ODK_REQUEST_OPTIONS, {
  auth: ODK_REQUEST_AUTH
});

const odkRequest = request.defaults(ODK_AUTH_REQUEST_OPTIONS);

const odkRequestGetAsync = BPromise.promisify(
  odkRequest.get, {multiArgs: true}
);

/**
 * [generic description]
 * @param  {Object} options [description]
 * @param {string} options.url [description]
 * @param {?Object} [options.query]
 * @return {Promise.<string>}         [description]
 */
const passthroughGet = function(options) {
  log.debug('ODK GET request pass through', options);
  return odkRequestGetAsync({
    url: options.url,
    qs: options.query
  });
};

/**
 * Fetches a list of forms from ODK Aggregate
 *
 * @param {?Object} [options] [description]
 * @param {string} [options.formId] [description]
 * @param {string} [options.verbose] [description]
 * @param {string} [options.listAllVersions] [description]
 *
 * @return {Promise.<http.IncomingMessage,string>} The response and respose body
 */
const formList = function(options) {
  log.debug('ODK formlist request', options);
  return odkRequestGetAsync({
    url: '/formList',
    qs: {
      formId: options.formId,
      verbose: options.verbose,
      listAllVersions: options.listAllVersions
    }
  });
};

/**
 * Fetches the submission list for a single ODK Aggregate form
 *
 * @param {Object} options [description]
 * @param  {!string} options.formId A formID from ODK. This value should appear
 *                                  as the text content in a <xform><formID> on
 *                                  the /formList ODK endpoint
 * @param {?number|string} [options.entries] Limits the number of submissions
 *                                           returned.
 * @param {?string} [options.cursor] The resumptionCursor holds opaque data that
 *                                   is used by the server to track the location
 *                                   at which to resume the list of ids
 * @return {Promise.<http.IncomingMessage,string>} The response and respose body
 */
const submissionList = function(options) {
  if (!options.formId) {
    throw new Error('formId is a required parameter');
  }
  var query = {formId: options.formId};
  if (typeof options.entries !== 'undefined') {
    query.numEntries = options.entries;
  }
  if (typeof options.cursor !== 'undefined') {
    query.cursor = options.cursor;
  }

  log.debug('ODK /view/submissionList formId=' + options.formId +
            ' entries=' + options.entries);
  log.debug('submissionList cursor:', options.cursor || 'N/A');
  return odkRequestGetAsync({
    url: '/view/submissionList',
    qs: query
  });
};

/**
 * Fetches the data for a single ODK Aggregate form submission.
 *
 * http://odk.kharatsa.com/view/downloadSubmission?formId=sample-origin[@version=null%20and%20@uiVersion=null]/sample-origin[@key=uuid:5b6d9e64-e721-42d7-88d4-b3fe62ec2ec1]
 *
 * @param {Object} options
 * @param  {!string} options.formId    The ODK formID for the submission.
 * @param  {?string} [options.topElement] Name of the top-level element in the
 *                                    form submission. This is the element
 *                                    within the instance element of the model
 *                                    that has the id attribute identifying the
 *                                    formid.
 * @param  {!string} options.submissionId The value of the id returned by the
 *                                    view/submissionList API
 * @return {Promise.<http.IncomingMessage,string>} The response and respose body
 */
// const downloadSubmission = function(formId, topElement, submissionId) {
const downloadSubmission = function(options) {
  var formId = options.formId;
  if (!options.formId) {
    throw new Error('formId is a required parameter');
  }

  var submissionId = options.submissionId;
  if (!options.submissionId) {
    throw new Error('Submission Id is a required parameter');
  }
  // The formID is reused in most cases as the topElement
  var topElement = options.topElement ? options.topElement : options.formId;

  var query = formId + '[@version=null and @uiVersion=null]/' +
    topElement + '[@key=' +
    submissionId + ']';
  log.debug('downloadSubmission query:\n\t%s', query);

  return odkRequestGetAsync({
    url: '/view/downloadSubmission',
    qs: {formId: query}
  });
};

/**
 * Generates a new authorization header from an request and its response.
 *
 * @param  {http.ClientRequest} req
 * @param  {http.IncomingMessage} res
 * @param  {string} method The HTTP request method
 * @return {Object}        [description]
 */
function buildAuthorizationHeader(req, res, method) {
  req.method = method;
  var auth = new Auth(req);
  auth.hasAuth = true;
  auth.user = ODK_REQUEST_AUTH.user;
  auth.pass = ODK_REQUEST_AUTH.pass;

  var authHeader = auth.onResponse(res);
  log.debug('Authorization header', authHeader);
  return authHeader;
}

function authorizationRequired(res) {
  return res.statusCode === 401;
}

const SUBMISSION_OPTIONS = Object.assign({}, ODK_REQUEST_OPTIONS, {
  url: '/submission'
});

/**
 * Conducts a HEAD request to retrieve fresh Authorization headers from the
 * ODK server. These headers are updated, and used with the multipart form
 * submission to ODK.
 *
 * TODO: Make this less hacky
 *
 * @param  {string} submission Form submission XML
 * @return {Promise.<Array.<http.IncomingMessage, string>>}
 */
function makeSubmission(submission) {
  if (!submission) {
    let err = new Error('Missing submission XML');
    BPromise.reject(err);
  }
  log.debug('Making ODK Aggregate form submission', submission);

  return new BPromise((resolve, reject) => {

    var headReq = request.head(SUBMISSION_OPTIONS, (err, res) => {
      if (err) {
        reject(err);
      }

      // Build the form
      var form = new FormData();
      form.append('xml_submission_file', submission, {
        filename: 'submission.xml',
        contentType: 'text/xml'
      });
      var postHeaders = Object.assign({},
        OPEN_ROSA_HEADERS,
        form.getHeaders()
      );

      if (authorizationRequired(res)) {
        postHeaders.Authorization = buildAuthorizationHeader(
          headReq, res, 'POST'
        );
      }

      var postOptions = Object.assign({},
        SUBMISSION_OPTIONS,
        {headers: postHeaders}
      );

      var postReq = request.post(postOptions, (err, res, body) => {
        if (err) {
          reject(err);
        }
        resolve([res, body]);
      });
      postReq._form = form;
    });
  });
}

module.exports = {
  passthroughGet,
  formList,
  submissionList,
  downloadSubmission,
  makeSubmission,
  setOpenRosaHeaders
};
