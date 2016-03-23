'use strict';

const rawqueryutils = require('app/server/stt/clients/rawqueryutils.js');

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
  LEFT OUTER JOIN Changes c on c.artifact = a.uuid
  WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
  AND NOT EXISTS (
    SELECT 1 FROM LabTests t2
    INNER JOIN Changes c2 on c2.labTest = t2.uuid
    WHERE t2.uuid = t.uuid
    AND c2.status = 'DEL'
  )`;
};

const artifactStagesRaw = params => {
  return `SELECT
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
    GROUP BY c.stage, c.status, a.artifactType`;
};

const testStatusRaw = params => {
  return `SELECT
      t.testType AS "Summary.testType",
      c.status AS "Summary.status",
      c.labRejection AS "Summary.testRejection",
      COUNT(DISTINCT s.uuid) AS "Summary.sampleIdsCount",
      COUNT(DISTINCT t.uuid) AS "Summary.labTestsCount"
    FROM SampleIds s
    INNER JOIN LabTests t ON t.sampleId = s.uuid
    INNER JOIN Changes c on c.labTest = t.uuid
    ${rawqueryutils.regionQueryInnerJoin(params)}
    WHERE s.createdAt >= $afterDate
    ${rawqueryutils.sampleBeforeCondition(params)}
    ${rawqueryutils.originFacilityCondition(params) ||
      rawqueryutils.originRegionCondition(params)}
    AND NOT EXISTS (
      SELECT 1 FROM LabTests t2
      INNER JOIN Changes c2 on c2.labTest = t2.uuid
      WHERE t2.uuid = t.uuid
      AND c2.status = 'DEL'
    )
    GROUP BY c.status, c.labRejection, t.testType`;
};

// const turnAroundTimeRaw = () => {
//   return ``;
// };

module.exports = {
  totalsRaw, artifactStagesRaw, testStatusRaw
};
