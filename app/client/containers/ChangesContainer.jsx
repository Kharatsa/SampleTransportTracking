import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {Changes} from '../components';

export const ChangesContainer = connect(
  state => ({
    changeIds: state.changeIds,
    changesById: state.changesById,
    samplesById: state.samplesById,
    artifactsById: state.artifactsById,
    labTestsById: state.labTestsById,
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    metaLabTests: state.metaLabTestsByKey,
    metaFacilities: state.metaFacilitiesByKey,
    metaPeople: state.metaPeopleByKey,
    summaryFilter: state.summaryFilter
  }),
  dispatch => ({actions: bindActionCreators({fetchChanges}, dispatch)})
)(Changes);

export default ChangesContainer;
