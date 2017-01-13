import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsSampleReady} from '../selectors/uiselectors';
import {fetchSampleDetail} from '../actions/actioncreators.js';
import {SampleDetail} from '../components';
import {waitOnReady, callOnMount} from '../components/Utils';

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
    {fetchSampleDetail}),
  callOnMount(({fetchSampleDetail}) => fetchSampleDetail()),
  waitOnReady,
)(SampleDetail);

export default SampleDetailContainer;
