import {fromJS, List, Map as ImmutableMap} from 'immutable';
import {createSelector} from 'reselect';
import {
  SCAN_STAGES_ORDER,
  REQUEST_SCAN_ARTIFACTS,
  RESULT_SCAN_ARTIFACTS,
  SCAN_STATUSES,
  LAB_STATUSES_ORDER,
  isRequestScanStage,
  isResultScanStage
} from '../../common/sttworkflow';

const getSampleIdCounts = (state) => state.summarySampleIds;
const getArtifactCounts = (state) => state.summaryArtifacts;
const getLabTestCounts = (state) => state.summaryLabTests;
const getMetaLabTestKeys = (state) => state.metaLabTestsKeys;

// Returns Array of Objects
// Elements of array each represent a stage
export const getSampleIdsStageCounts = createSelector(
  [getSampleIdCounts],
  (counts) => fromJS(
    SCAN_STAGES_ORDER.map(stage => {
      const count = counts.get(stage) || 0;
      return ({stage, count});
    }))
);

const requestArtifacts = (
  Object.keys(REQUEST_SCAN_ARTIFACTS)
  .map(key => REQUEST_SCAN_ARTIFACTS[key]));

const resultArtifacts = (
  Object.keys(RESULT_SCAN_ARTIFACTS)
  .map(key => RESULT_SCAN_ARTIFACTS[key]));

const getOneStageArtifactCounts = (stageArtifacts, counts) => {
  return stageArtifacts.map(artifact => {
    const artifactCount = counts.get(artifact);
    let result = {artifact, goodCount: null, badCount: null};

    if (artifactCount) {
      result.goodCount = artifactCount.get(SCAN_STATUSES.GOOD);
      result.badCount = artifactCount.get(SCAN_STATUSES.BAD);
    }

    return result;
  });
};

// Array of Arrays
//  Outer Array represents workflow stages
//  Inner Arrays represent Artifacts at each stage
export const getArtifactStageCounts = createSelector(
  [getArtifactCounts],
  (counts) => {
    if (counts.size === 0) {
      return List();
    }

    return fromJS(SCAN_STAGES_ORDER.map(stage => {
      const stageCounts = counts.get(stage);

      if (typeof stageCounts === 'undefined') {
        return [];
      }

      let artifacts;
      if (isRequestScanStage(stage)) {
        artifacts = getOneStageArtifactCounts(requestArtifacts, stageCounts);
      } else if (isResultScanStage(stage)) {
        artifacts = getOneStageArtifactCounts(resultArtifacts, stageCounts);
      } else {
        throw new Error(`Unrecognized stage name "${stage}"`);
      }
      return {stage, artifacts};
    }));
  }
);

const getOneLabTestStatusCounts = (test, counts) => {
  return List(LAB_STATUSES_ORDER.map(status =>
    ImmutableMap({status, count: counts.get(status) || 0})));
};

export const getLabTestStatusCounts = createSelector(
  [getMetaLabTestKeys, getLabTestCounts],
  (testKeys, counts) => {
    if (counts.size === 0) {
      return List();
    }
    const labStatusCounts = counts.first();

    return List(testKeys.map(test => ImmutableMap({
      test,
      statuses: getOneLabTestStatusCounts(test, labStatusCounts.get(test))
    })));
  }
);
