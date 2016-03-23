'use strict';

/** @module stt/sttclient/changes */

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');
const rawqueryutils = require('app/server/stt/clients/rawqueryutils.js');

/**
 * [description]
 * @method changesTestsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const labTestsAndDates = queryutils.requireProps(['labTest', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]})
  )
  .then(queryutils.wrapOr)
);

/**
 * [description]
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
  artifactsColumns, 'a', 'Artifact');

const labTestsColumns = ['uuid', 'sampleId', 'testType', 'createdAt',
                         'updatedAt'];
const labTestsSelectExpression = queryutils.makeSelectExpression(
  labTestsColumns, 'r', 'LabTest');

const sampleIdsColumns = ['uuid', 'stId', 'labId', 'origin', 'outstanding',
                          'createdAt', 'updatedAt'];
const sampleIdsSelectExpression = queryutils.makeSelectExpression(
  sampleIdsColumns, 's', 'SampleId');

/**
 * @param  {Object} params
 * @param {string} [params.facilityKey]
 * @param {string} [params.regionKey]
 * @return {string}
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
    WHERE s.createdAt >= $afterDate
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
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    ORDER BY c.statusDate DESC`;
};

module.exports = {
  labTestsAndDates, artifactsAndDates, changesRaw
};
