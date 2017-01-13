import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsSampleReady} from '../selectors/uiselectors';
import {
  fetchSampleDetail, changeSelectedSample
} from '../actions/actioncreators.js';
import {SampleDetail} from '../components';
import {callOnMount, waitOnReady, watchRouter} from '../components/Utils';

export const SampleDetailContainer = compose(
  connect(
    state => ({
      isReady: getIsSampleReady(state),
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
    {fetchSampleDetail, changeSelectedSample}),
  watchRouter(
    ({params}) => params.sampleId,
    (sampleId, {changeSelectedSample}) => changeSelectedSample(sampleId),
  ),
  callOnMount(({fetchSampleDetail, selectedSampleId}) => {
    return fetchSampleDetail(selectedSampleId);
  }),
  waitOnReady,
)(SampleDetail);

export default SampleDetailContainer;
