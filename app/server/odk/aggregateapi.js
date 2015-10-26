'use strict';

const Bluebird = require('bluebird');
const request = require('request');
const odkConfig = require('app/config.js').ODK;

/**
 * TODO: document
 * @const
 * @type {Object}
 */
const OPEN_ROSA_HEADERS = {
  'Accept-Language': 'en',
  'X-OpenRosa-Version': '1.0',
};
// 'Date': (new Date()).toGMTString()

// function getOpenRosaHeaders() {
//   var headers = JSON.parse(JSON.stringify(OPEN_ROSA_HEADERS));
//   headers.Date = (new Date()).toGMTString();
//   return headers;
// }

var XML_CHAR_MAP = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  '\'': '&apos;'
};
var XML_ESCAPED_MAP = {};
Object.keys(XML_CHAR_MAP).forEach(function(key) {
  var val = XML_CHAR_MAP[key];
  XML_ESCAPED_MAP[val] = key;
});

/**
 * [unescapeXML description]
 *
 * @param  {String} xml [description]
 * @return {String}     [description]
 */
// function unescapeXML(xml) {
//   return xml.replace(/&(lt|gt|amp|quot|apos);/g, function(match) {
//     return XML_ESCAPED_MAP[match];
//   });
// }

/**
 * [formList description]
 *
 * @return {Bluebird} [description]
 */
var formList = function formListFunc() {
  return new Bluebird(function(resolve, reject) {
    request.get({
      'url': '/formList',
      'baseUrl': odkConfig.protocol + '://' + odkConfig.hostname,
      'headers': OPEN_ROSA_HEADERS
    }, function(err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};
exports.formList = formList;

/**
 * [submissionList description]
 *
 * @param  {String} formId  [description]
 * @param  {Number} entries [description]
 * @return {Bluebird} [description]
 */
var submissionList = function submissionListFunc(formId, entries) {
  return new Bluebird(function(resolve, reject) {
    request.get({
      'url': '/view/submissionList',
      'baseUrl': odkConfig.protocol + '://' + odkConfig.hostname,
      'headers': OPEN_ROSA_HEADERS,
      'qs': {
        'formId': formId,
        'numEntries': entries
      }
    }, function(err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};
exports.submissionList = submissionList;

/**
 * [downloadSubmission description]
 *
 * @param  {String} formId  [description]
 * @param  {String} submissionId [description]
 * @return {Bluebird} [description]
 */
var downloadSubmission = function downloadSubmissionFunc(formId, submissionId) {
  return new Bluebird(function(resolve, reject) {
    var query = 'formid[@version=null and @uiVersion=null]/' +
      formId + '[@key=' + submissionId + ']';

    request.get({
      'url': '/view/downloadSubmission',
      'baseUrl': odkConfig.protocol + '://' + odkConfig.hostname,
      'headers': OPEN_ROSA_HEADERS,
      'qs': {
        'formId': query
      }
    }, function(err, res, body) {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};
exports.downloadSubmission = downloadSubmission;
