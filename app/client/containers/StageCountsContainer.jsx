import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts} from '../components';

export const StageCountsContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    sampleIdsStageCounts: getSampleIdsStageCounts(state),
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
    labTestCounts: getLabTestStatusCounts(state)
  }),
  {fetchSummary},
)(StageCounts);

export default StageCountsContainer;
