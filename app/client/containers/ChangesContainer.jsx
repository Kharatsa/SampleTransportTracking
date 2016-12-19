import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {getChangesDetail} from '../selectors/changes_selectors';
import Changes from '../components/Changes';

export const ChangesContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    changes: getChangesDetail(state),
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    metaArtifacts: state.metaArtifactsByKey,
    metaLabTests: state.metaLabTestsByKey,
    metaFacilities: state.metaFacilitiesByKey,
    metaPeople: state.metaPeopleByKey,
    summaryFilter: state.summaryFilter,
  }),
  {fetchChanges},
)(Changes);

export default ChangesContainer;