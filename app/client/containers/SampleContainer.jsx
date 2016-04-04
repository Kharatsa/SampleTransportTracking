import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchSampleDetail} from '../actions/actioncreators.js';
import {Sample} from '../components';

export default connect(
  state => ({
    isFetchingData: state.isFetchingData,
    selectedSampleId: state.selectedSampleId,
    samplesById: state.samplesById,
    changeIds: state.changeIds,
    changesById: state.changesById,
    artifactIds: state.artifactIds,
    artifactsById: state.artifactsById,
    labTestIds: state.labTestIds,
    labTestsById: state.labTestsById,
    changesByArtifactId: state.changesByArtifactId,
    changesByLabTestId: state.changesByLabTestId,
    changesByStage: state.changesByStage,
    metadata: state.metadata
  }),
  dispatch => ({actions: bindActionCreators({fetchSampleDetail}, dispatch)})
)(Sample);