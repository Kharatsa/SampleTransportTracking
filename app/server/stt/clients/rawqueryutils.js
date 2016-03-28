'use strict';

const checkRequired = params => {
  if (!params.afterDate) {
    throw new Error('Missing required parameter afterDate');
  }
};

const isRegionChangesQuery = params => {
  return typeof params.regionKey !== 'undefined';
};

const regionQueryInnerJoin = params => {
  if (isRegionChangesQuery(params)) {
    return `INNER JOIN MetaFacilities mf ON mf.key = s.origin`;
  }
  return '';
};

const sampleIdCondition = params => {
  if (typeof params.sampleId !== 'undefined') {
    return 'AND (s.stId = $sampleId OR s.labId = $sampleId)';
  }
  return '';
};

const sampleBeforeCondition = params => {
  if (typeof params.beforeDate !== 'undefined') {
    return `AND s.createdAt < $beforeDate`;
  }
  return '';
};

const originFacilityCondition = params => {
  if (typeof params.facilityKey !== 'undefined') {
    return `AND s.origin = $facilityKey`;
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
  checkRequired,
  regionQueryInnerJoin,
  sampleIdCondition,
  sampleBeforeCondition,
  originFacilityCondition,
  originRegionCondition,
  limitOffsetExpression
};
