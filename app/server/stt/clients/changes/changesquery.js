'use strict';

/** @module stt/sttclient/changes */

const _ = require('lodash');
const BPromise = require('bluebird');
const queryutils = require('server/storage/queryutils.js');
const rawqueryutils = require('server/stt/clients/rawqueryutils.js');

/**
 * @method changesTestsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const labTests = queryutils.requireProps(['labTest'],
  changes => BPromise.map(changes, change => ({labTest: change.labTest}))
  .then(queryutils.wrapOr)
);

/**
 * @method changesArtifactsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const artifactsAndDates = queryutils.requireProps(
  ['artifact', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{artifact: change.artifact}, {statusDate: change.statusDate}]})
  )
  .then(queryutils.wrapOr)
);

const changesColumns = ['uuid', 'statusDate', 'stage', 'artifact', 'labTest',
                        'facility', 'person', 'status', 'labRejection',
                        'createdAt', 'updatedAt'];
const changesSelectExpression = queryutils.makeSelectExpression(
  changesColumns, 'c', 'Change');

const artifactsColumns = ['uuid', 'sampleId', 'artifactType', 'createdAt',
                          'updatedAt'];
const artifactsSelectExpression = queryutils.makeSelectExpression(
  artifactsColumns, 'a', 'Ref');

const labTestsColumns = ['uuid', 'sampleId', 'testType', 'createdAt',
                         'updatedAt'];
const labTestsSelectExpression = queryutils.makeSelectExpression(
  labTestsColumns, 'r', 'Ref');

const sampleIdsColumns = ['uuid', 'stId', 'labId', 'origin', 'outstanding',
                          'createdAt', 'updatedAt'];
const sampleIdsSelectExpression = queryutils.makeSelectExpression(
  sampleIdsColumns, 's', 'SampleId');

/**
 * @typedef {Object} ChangesQueryParams
 * @property {string} [facilityKey]
 * @property {string} [regionKey]
 * @property {number} [limit=50]
 * @property {number} [offset]
 * @property {string} [sampleId]
 * @property {string} [beforeDate] ISO8601-format Date string
 *
 */

const changesRawDateCols = [
  'Change.statusDate',
  'Change.createdAt',
  'Change.updatedAt',
  'SampleId.createdAt',
  'SampleId.updatedAt',
  'Ref.createdAt',
  'Ref.updatedAt'
];

/**
 * @param  {ChangesQueryParams} params
 * @return {string} Raw SQL query string
 */
const changesRaw = params => {
  return `SELECT
    ${changesSelectExpression},
    ${artifactsSelectExpression},
    ${sampleIdsSelectExpression}
    FROM Changes c
    INNER JOIN Artifacts a ON a.uuid = c.artifact
    INNER JOIN SampleIds s ON s.uuid = a.sampleId
    ${rawqueryutils.regionQueryInnerJoin(params)}
    WHERE 1
    ${rawqueryutils.sampleAfterCondition(params)}
    ${rawqueryutils.sampleIdCondition(params)}
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}

    UNION ALL

    SELECT
    ${changesSelectExpression},
    ${labTestsSelectExpression},
    ${sampleIdsSelectExpression}
    FROM Changes c
    INNER JOIN LabTests r ON r.uuid = c.labTest
    INNER JOIN SampleIds s ON s.uuid = r.sampleId
    ${rawqueryutils.regionQueryInnerJoin(params)}
    WHERE 1
    ${rawqueryutils.sampleAfterCondition(params)}
    ${rawqueryutils.sampleIdCondition(params)}
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    ORDER BY "Changes.statusDate" DESC
    ${rawqueryutils.limitOffsetExpression(params)}`;
};

/**
 * @param  {ChangesQueryParams} params
 * @return {string} Raw SQL query string
 */
const changesRawCount = params => {
  const countParams = _.omit(params, ['limit', 'offset']);
  return (
    'SELECT COUNT (1) AS "ChangesCount" ' +
    `FROM (${changesRaw(countParams)}) AS agg`);
};

module.exports = {
  labTests, artifactsAndDates,
  changesRaw, changesRawDateCols, changesRawCount
};
