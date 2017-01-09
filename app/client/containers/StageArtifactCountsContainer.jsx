import {connect} from 'react-redux';
import {getArtifactStageCounts} from '../selectors/dashboardselectors';
import StageArtifactCounts from '../components/Dashboard/StageArtifacts';

export const StageArtifactCountsContainer = connect(
  state => ({
    metaStages: state.metaStagesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    artifactStageCounts: getArtifactStageCounts(state),
  })
)(StageArtifactCounts);

export default StageArtifactCountsContainer;
