import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts2} from '../components';


export const StageCountsContainer2 = connect(
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
)(StageCounts2);

export default StageCountsContainer2;