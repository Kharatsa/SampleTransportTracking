import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchSummary} from '../actions/actioncreators';
import {
  getSampleIdsStageCounts, getArtifactStageCounts, getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {StageCounts} from '../components';

export const StageCountsContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    sampleIdsStageCounts: getSampleIdsStageCounts(state),
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
    labTestCounts: getLabTestStatusCounts(state)
  }),
  dispatch => ({actions: bindActionCreators({fetchSummary}, dispatch)})
)(StageCounts);

export default StageCountsContainer;
