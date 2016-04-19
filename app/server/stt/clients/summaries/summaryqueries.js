'use strict';

const rawqueryutils = require('server/stt/clients/rawqueryutils.js');

const checkRequired = params => {
  if (!params.afterDate) {
    throw new Error('Missing required parameter afterDate');
  }
};

const totalsRaw = params => {
  return `
  SELECT
    COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount",
    COUNT(DISTINCT a.uuid) AS "Summary.artifactsCount",
    COUNT(DISTINCT t.uuid) AS "Summary.labTestsCount"
  FROM SampleIds s
  ${rawqueryutils.regionQueryInnerJoin(params)}
  LEFT OUTER JOIN Artifacts a ON a.sampleId = s.uuid
  LEFT OUTER JOIN LabTests t ON t.sampleId = s.uuid
  LEFT OUTER JOIN Changes c ON (c.artifact = a.uuid OR c.labTest = t.uuid)
  WHERE s.createdAt >= $afterDate
  ${rawqueryutils.sampleBeforeCondition(params)}
  ${rawqueryutils.originFacilityCondition(params) ||
    rawqueryutils.originRegionCondition(params)}
  ${rawqueryutils.exceptDeletedTestsExpression(params, {labTestsAlias: 't'})}`;
};

const totalsDateSeries = params => {
  return `
    SELECT
      c.stage AS "Summary.stage",
      DATE(c.statusDate) AS "Summary.statusDate",
      COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount"
    FROM SampleIds s
    ${rawqueryutils.regionQueryInnerJoin(params)}
    INNER JOIN Artifacts a ON a.sampleId = s.uuid
    INNER JOIN Changes c ON c.artifact = a.uuid
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    GROUP BY "Summary.stage", "Summary.statusDate"
    ORDER BY "Summary.statusDate"`;
};

const artifactStagesRaw = params => {
  return `
    SELECT
      c.stage AS "Summary.stage",
      NULL AS "Summary.status",
      NULL AS "Summary.artifactType",
      COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount",
      NULL  AS "Summary.artifactsCount"
    FROM SampleIds s
    INNER JOIN Artifacts a ON a.sampleId = s.uuid
    INNER JOIN Changes c on c.artifact = a.uuid
    ${rawqueryutils.regionQueryInnerJoin(params)}
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    GROUP BY "Summary.stage"
    UNION ALL
    SELECT
      c.stage AS "Summary.stage",
      c.status AS "Summary.status",
      a.artifactType AS "Summary.artifactType",
      COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount",
      COUNT(DISTINCT a.uuid) AS "Summary.artifactsCount"
    FROM SampleIds s
    INNER JOIN Artifacts a ON a.sampleId = s.uuid
    INNER JOIN Changes c on c.artifact = a.uuid
    ${rawqueryutils.regionQueryInnerJoin(params)}
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    GROUP BY "Summary.stage", "Summary.status", "Summary.artifactType"`;
};

const testStatusRaw = params => {
  return `SELECT
      c.stage AS "Summary.stage",
      t.testType AS "Summary.testType",
      c.status AS "Summary.status",
      c.labRejection AS "Summary.testRejection",
      COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount",
      COUNT(DISTINCT t.uuid) AS "Summary.labTestsCount"
    FROM SampleIds s
    ${rawqueryutils.regionQueryInnerJoin(params)}
    INNER JOIN LabTests t ON t.sampleId = s.uuid
    INNER JOIN Changes c on c.labTest = t.uuid
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    ${rawqueryutils.exceptDeletedTestsExpression(params, {labTestsAlias: 't'})}
    GROUP BY "Summary.stage", "Summary.status", "Summary.testType",
      "Summary.testRejection"`;
};

const tatDateCols = [
  'Summary.sampleIdCreatedAt',
  'Summary.changeFirstDate'
];

const stageTATsRaw = params => {
  return `
      SELECT
      s.uuid AS "Summary.sampleId",
      s.createdAt "Summary.sampleIdCreatedAt",
      c.stage AS "Summary.changeStage",
      null AS "Summary.changeStatus",
      MIN(c.statusDate) AS "Summary.changeFirstDate"
    FROM SampleIds s
    ${rawqueryutils.regionQueryInnerJoin(params)}
    INNER JOIN Artifacts a ON a.sampleId = s.uuid
    INNER JOIN Changes c ON c.artifact = a.uuid
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    GROUP BY
      "Summary.sampleIdsUUID",
      "Summary.sampleIdCreatedAt",
      "Summary.changeStage",
      "Summary.changeStatus"
    UNION ALL
    SELECT
      s.uuid AS "Summary.sampleId",
      s.createdAt "Summary.sampleIdCreatedAt",
      c.stage AS "Summary.changeStage",
      c.status AS "Summary.changeStatus",
      MIN(c.statusDate) AS "Summary.changeFirstDate"
    FROM SampleIds s
    ${rawqueryutils.regionQueryInnerJoin(params)}
    INNER JOIN LabTests t ON t.sampleId = s.uuid
    INNER JOIN Changes c ON c.labTest = t.uuid
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    ${rawqueryutils.exceptDeletedTestsExpression(params, {labTestsAlias: 't'})}
    GROUP BY
      "Summary.sampleIdsUUID",
      "Summary.sampleIdCreatedAt",
      "Summary.changeStage",
      "Summary.changeStatus"`;
};

module.exports = {
  checkRequired,
  totalsRaw, totalsDateSeries, artifactStagesRaw, testStatusRaw,
  tatDateCols, stageTATsRaw
};
