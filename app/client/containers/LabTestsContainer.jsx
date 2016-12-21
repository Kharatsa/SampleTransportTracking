import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import { getArtifactStageCounts, getLabTestStatusCounts} from '../selectors/dashboardselectors';
import {LabTestCounts} from '../components';

export const LabTestsContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
    metaStatuses: state.metaStatusesByKey,
    metaLabTests: state.metaLabTestsByKey,
    labTestCounts: getLabTestStatusCounts(state)
  }),
  {fetchSummary},
)(LabTestCounts);

export default LabTestsContainer;
