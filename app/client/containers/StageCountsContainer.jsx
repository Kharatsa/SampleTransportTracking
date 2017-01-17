import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts} from '../components';
import {waitOnReady} from '../components/Utils';

export const StageCountsContainer = compose(
  connect(
    state => ({
      isReady: getIsSummaryReady(state),
      artifactStageCounts: getArtifactStageCounts(state),
      labTestCounts: getLabTestStatusCounts(state),
      sampleIdsStageCounts: getSampleIdsStageCounts(state),
      metaArtifacts: state.metaArtifactsByKey,
      metaLabTests: state.metaLabTestsByKey,
      metaStages: state.metaStagesByKey,
      metaStatuses: state.metaStatusesByKey,
    })
  ),
  waitOnReady,
)(StageCounts);

export default StageCountsContainer;
