import {connect} from 'react-redux';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {getArtifactStageCounts} from '../selectors/dashboardselectors';
import StageArtifactCounts from '../components/Dashboard/StageArtifacts/StageArtifactCounts';
import {WaitOnReady} from '../components/Utils';

export const StageArtifactCountsContainer = connect(
  state => ({
    isReady: getIsSummaryReady(state),
    metaStages: state.metaStageByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
  })
)(WaitOnReady(StageArtifactCounts));

export default StageArtifactCountsContainer;
