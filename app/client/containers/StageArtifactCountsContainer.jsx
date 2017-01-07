import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {getArtifactStageCounts} from '../selectors/dashboardselectors';
import StageArtifactCounts from '../components/Dashboard/StageArtifacts';
import {CallOnMount, WaitOnReady} from '../components/Utils';

export const StageArtifactCountsContainer = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    onMountFunc: 'fetchSummary',
    metaStages: state.metaStagesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
  }),
  {fetchSummary},
)(CallOnMount(WaitOnReady(StageArtifactCounts)));

export default StageArtifactCountsContainer;
