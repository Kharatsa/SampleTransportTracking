import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {Changes} from '../components';

export const ChangesContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
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
  {fetchChanges},
)(Changes);

export default ChangesContainer;
