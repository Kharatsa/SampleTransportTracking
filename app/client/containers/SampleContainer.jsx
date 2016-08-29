import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getIsLoading} from '../selectors/uiselectors';
import {fetchSampleDetail} from '../actions/actioncreators.js';
import {Sample} from '../components';

export default connect(
  state => ({
    isLoading: getIsLoading(state),
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
    metaArtifacts: state.metaArtifactsByKey,
    metaStatuses: state.metaStatusesByKey,
    metaStages: state.metaStagesByKey,
    metaPeople: state.metaPeopleByKey,
    metaFacilities: state.metaFacilitiesByKey,
    metaLabTests: state.metaLabTestsByKey
  }),
  {fetchSampleDetail},
)(Sample);
