'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const moment = require('moment');
const sttworkflow = require('common/sttworkflow');
const datecalc = require('common/datecalc');
// const log = require('server/util/logapp.js');

const recomposeRawSummary = BPromise.method((data, options) => {
  const nested = options.children || [];
  const template = nested.reduce((reduced, key) => {
    reduced[key] = {};
    return reduced;
  }, {});

  const parentModelName = options.parent;
  return BPromise.reduce(Object.keys(data), (reduced, key) => {
    const record = data[key];
    const parts = key.split('.');
    const modelName = parts[0];
    const columnName = parts[1];
    if (modelName === parentModelName) {
      reduced[columnName] = record;
    } else {
      reduced[modelName][columnName] = record;
    }
    return reduced;
  }, template);
});

// Target shape:
// artifactCounts
//  stage
//    artifactType
//      status: count

const artifactCountsTemplate = (
  Object.keys(sttworkflow.SCAN_STATUSES)
  .map(key => sttworkflow.SCAN_STATUSES[key])
  .reduce((reduced, status) => {
    reduced[status] = 0;
    return reduced;
  }, {}));

const scanStageCountsTemplate = (
  Object.keys(sttworkflow.SCAN_ARTIFACTS)
  .map(key => sttworkflow.SCAN_ARTIFACTS[key])
  .reduce((reduced, artifact) => {
    reduced[artifact] = _.cloneDeep(artifactCountsTemplate);
    return reduced;
  }, {}));

const stageArtifactCountTemplate = (
  sttworkflow.SCAN_STAGES_ORDER
  .reduce((reduced, stage) => {
    reduced[stage] = _.cloneDeep(scanStageCountsTemplate);
    return reduced;
  }, {}));

const isSampleIdCount = row => row.artifactType === null;
const isArtifactCount = row => !isSampleIdCount(row);

// sampleIdCounts
//  stage
//    count

const sampleIdCountTemplate = (
  sttworkflow.SCAN_STAGES_ORDER
  .reduce((reduced, stage) => {
    reduced[stage] = 0;
    return reduced;
  }, {}));

const composeSampleIdsCount = BPromise.method(data => {
  const result = _.cloneDeep(sampleIdCountTemplate);

  return BPromise.filter(data, isSampleIdCount)
  .each(row => result[row.stage] += row.sampleIdsCount)
  .then(() => result);
});

const composeArtifactsCount = data => {
  const result = _.cloneDeep(stageArtifactCountTemplate);

  return BPromise.filter(data, isArtifactCount)
  .each(row => {
    result[row.stage][row.artifactType][row.status] += row.artifactsCount || 0;
  })
  .then(() => result);
};

const composeCountGroups = data => {
  return BPromise.props({
    sampleIdsCount: composeSampleIdsCount(data),
    artifactsCount: composeArtifactsCount(data)
  });
};

// Target shape:
// labTestCounts
//  testType
//    status: count

const testCountsTemplate = (
  Object.keys(sttworkflow.LAB_STATUSES)
  .map(key => sttworkflow.LAB_STATUSES[key])
  .reduce((reduced, status) => {
    reduced[status] = 0;
    return reduced;
  }, {}));

const stageTestCountTemplate = (
  sttworkflow.LAB_STAGES_ORDER
  .reduce((reduced, stage) => {
    // All test types are not fixed ahead of time, so the template for testTypes
    // cannot be added here beneath the stage.
    reduced[stage] = {};
    return reduced;
  }, {}));

const composeLabTestGroup = BPromise.method(data => {
  const result = _.cloneDeep(stageTestCountTemplate);

  return BPromise.each(data, row => {
    if (typeof result[row.stage][row.testType] === 'undefined') {
      result[row.stage][row.testType] = _.cloneDeep(testCountsTemplate);
    }

    if (sttworkflow.isLabStatus(row.status)) {
      result[row.stage][row.testType][row.status] += row.labTestsCount || 0;
    }
  }).
  then(() => ({labTestsCount: result}));
});

const composeDateSampleIdCount = (date, data) => {
  return BPromise.reduce(sttworkflow.SCAN_STAGES_ORDER, (reduced, stage) => {
    if (typeof data[stage] !== 'undefined') {
      reduced[stage] = data[stage].sampleIdsCount || 0;
    } else {
      reduced[stage] = 0;
    }
    return reduced;
  }, {date});
};

// Target shape:
// Array of
//  {
//    date: 'some date',
//    SDEPART: some_value,
//    SARRIVE: some_value
//    ...
//  }

/**
 * @param {Object} data               Date series counts grouped by Date
 * @param {Object} options
 * @param {string} options.afterDate  ISO8601 Date string
 * @param {string} options.beforeDate ISO8601 Date string
 * @return {Array.<Object>}
 */
const composeDateSeriesCounts = BPromise.method((data, options) => {
  options = options || {};

  if (!options.afterDate) {
    throw new Error('Missing required parameter afterDate');
  }

  const afterDate = moment(options.afterDate);
  const beforeDate = options.beforeDate || moment.utc().toISOString();
  const datesRange = datecalc.allDatesBetween({afterDate, beforeDate});

  return BPromise.map(datesRange, momentDate => {
    const dateStr = momentDate.toISOString();
    const dateData = data[dateStr] || {};
    return composeDateSampleIdCount(dateStr, dateData);
  });
});

module.exports = {
  recomposeRawSummary,
  composeCountGroups,
  composeLabTestGroup,
  composeDateSeriesCounts
};
