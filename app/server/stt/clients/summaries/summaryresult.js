'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const sttworkflow = require('common/sttworkflow');
// const log = require('server/util/logapp.js');

const recomposeRawSummary = (data, options) => {
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
};

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

const composeSampleIdsCount = data => {
  const result = _.cloneDeep(sampleIdCountTemplate);

  return BPromise.filter(data, isSampleIdCount)
  .each(row => result[row.stage] += row.sampleIdsCount)
  .then(() => result);
};

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

const composeLabTestGroup = data => {
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
};

module.exports = {
  recomposeRawSummary, composeCountGroups, composeLabTestGroup
};
