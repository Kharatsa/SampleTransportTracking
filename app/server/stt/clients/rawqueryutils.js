'use strict';

const TEST_DELETED_STATUS = 'DEL';

/**
 * @param  {Object} params  [description]
 * @param  {Object} options [description]
 * @return {string}         [description]
 */
const exceptDeletedTestsExpression = (params, options) => {
  const labTestsAlias = options.labTestsAlias;
  return `AND NOT EXISTS (
    SELECT 1 FROM LabTests t2
    INNER JOIN Changes c2 on c2.labTest = t2.uuid
    WHERE t2.uuid = ${labTestsAlias}.uuid
    AND c2.status = '${TEST_DELETED_STATUS}')`;
};

const isRegionChangesQuery = params => {
  return typeof params.regionKey !== 'undefined';
};

const regionQueryInnerJoin = params => {
  if (isRegionChangesQuery(params)) {
    return 'INNER JOIN MetaFacilities mf ON mf.key = s.origin';
  }
  return '';
};

const sampleIdCondition = params => {
  if (typeof params.sampleId !== 'undefined') {
    return 'AND (s.stId = $sampleId OR s.labId = $sampleId)';
  }
  return '';
};

const sampleAfterCondition = params => {
  if (typeof params.afterDate !== 'undefined') {
    return 'AND s.createdAt >= $afterDate';
  }
  return '';
};

const sampleBeforeCondition = params => {
  if (typeof params.beforeDate !== 'undefined') {
    return 'AND s.createdAt < $beforeDate';
  }
  return '';
};

const originFacilityCondition = params => {
  if (typeof params.facilityKey !== 'undefined') {
    return 'AND s.origin = $facilityKey';
  }
  return '';
};

const originRegionCondition = params => {
  if (isRegionChangesQuery(params)) {
    return 'AND mf.region = $regionKey';
  }
  return '';
};

const limitExpression = params => {
  if (typeof params.limit !== 'undefined') {
    return 'LIMIT $limit';
  }
  return '';
};

const offsetExpression = params => {
  if (typeof params.offset !== 'undefined') {
    return 'OFFSET $offset';
  }
  return '';
};

const limitOffsetExpression = params => {
  return `${limitExpression(params)} ${offsetExpression(params)}`;
};

module.exports = {
  exceptDeletedTestsExpression,
  regionQueryInnerJoin,
  sampleIdCondition,
  sampleAfterCondition,
  sampleBeforeCondition,
  originFacilityCondition,
  originRegionCondition,
  limitOffsetExpression
};
