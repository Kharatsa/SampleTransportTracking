import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsSampleDetailReady} from '../selectors/uiselectors';
import {SampleDetail} from '../components';
import {waitOnReady} from '../components/Utils';

export const SampleDetailContainer = compose(
  connect(
    state => ({
      isReady: getIsSampleDetailReady(state),
      selectedSampleId: state.sampleDetailUUID,
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
    })),
  waitOnReady,
)(SampleDetail);

export default SampleDetailContainer;
