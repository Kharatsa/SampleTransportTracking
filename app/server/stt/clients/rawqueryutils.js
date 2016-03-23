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
    return `AND mf.region = $regionKey`;
  }
  return '';
};

module.exports = {
  checkRequired,
  regionQueryInnerJoin,
  sampleBeforeCondition,
  originFacilityCondition,
  originRegionCondition
};
