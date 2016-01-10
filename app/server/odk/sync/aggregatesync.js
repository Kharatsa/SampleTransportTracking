'use strict';

const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateapi.js');
const transform = require('app/server/odk/sync/aggregatetransform.js');
const promisehelpers = require('app/server/util/promisehelpers.js');

/**
 * Fetches the form list XML from ODK Aggregate, converts the XML to JSON,
 * transforms the JSON to {@link Form} models, then inserts these forms in
 * the database.
 *
 * @return {Promise.<Array.<Form>} Resolves with an array of
 *                                               Sequelize Form instances.
 */
function getFormList() {
  log.info('Fetching ODK Aggregate form list');

  return aggregate.formList()
  .spread((res, body) => body)
  .tap(xml => {
    log.debug('Received form list XML', xml);
  })
  .then(transform.parseFormList);
}

/**
 * Get one batch of submission Ids for a form.
 *
 * @param  {!string} formId [description]
 * @param  {?string} [cursor] [description]
 * @return {Promise.<SubmissionList>}
 */
function getSubmissionIds(formId, cursor) {
  return aggregate.submissionList({formId, cursor})
  .spread((res, body) => body)
  .then(transform.parseSubmissionList);
  // .filter(sub => sub !== null);
}

/**
 * Fetches all submission Ids for a form. Fetching all submissions may require
 * many requests to ODK, using Aggregates resumption cursor paging mechanism.
 *
 *  ODK Briefcase Treatment
 *    ODK Briefcase repeatedly calls this API, passing in the previous
 *    response's resumptionCursor value until the returned resumptionCursor
 *    value matches that given in the request. Once it no longer changes,
 *    ODK Briefcase assumes that all id data has been downloaded from the
 *    server.
 *  https://github.com/opendatakit/opendatakit/wiki/Briefcase-Aggregate-API#odk-briefcase-treatment
 *
 * @param  {string} formId [description]
 * @return {Promise.<Array.<string>>}
 */
function getAllSubmissionIds(formId) {
  log.debug('Fetching ODK Aggregate submission IDs for formId=`%s`', formId);

  var prevCursor;
  var currentCursor;
  var empty;
  var count = 0;
  return promisehelpers.promiseWhile(
    () => {
      if (empty) {
        return false;
      }
      if (prevCursor && currentCursor) {
        return prevCursor !== currentCursor;
      }
      return true;
    },
    () => getSubmissionIds(formId, currentCursor)
    .tap(parsed => {
      count++;
      log.debug('Submission Id list #%s', count);
      prevCursor = currentCursor;
      currentCursor = parsed.cursor;
      empty = !!parsed;
    })
    .then(parsed => parsed.ids)
  );
}

function getSubmission(formId, submissionId) {
  log.debug('Fetching ODK Aggregate submissionId=`%s`', submissionId);

  return aggregate.downloadSubmission({formId, submissionId})
  .spread((res, body) => body)
  .tap(xml => {
    log.debug('Received submission XML', xml);
  })
  .then(transform.parseSubmission)
  .tap(parsed => {
    log.debug('Parsed Submission');
    console.dir(parsed, {depth: 10, colors: true});
  });
}

module.exports = {
  getFormList, getAllSubmissionIds, getSubmission
};
