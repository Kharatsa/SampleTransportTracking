import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts} from '../components';
import WaitOnFetch from '../components/WaitOnFetch';

export const StageCountsContainer = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    onMountFunc: 'fetchSummary',
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
)(WaitOnFetch(StageCounts));

export default StageCountsContainer;
