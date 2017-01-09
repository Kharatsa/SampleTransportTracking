import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators';
import {getIsChangesReady} from '../selectors/uiselectors';
import {getChangesDetail} from '../selectors/changes_selectors';
import Changes from '../components/Changes';
import {waitOnReady, callOnMount} from '../components/Utils';

export const ChangesContainer = compose(
  connect(
    state => ({
      isReady: getIsChangesReady(state),
      changes: getChangesDetail(state),
      metaStages: state.metaStagesByKey,
      metaStatuses: state.metaStatusesByKey,
      metaArtifacts: state.metaArtifactsByKey,
      metaLabTests: state.metaLabTestsByKey,
      metaFacilities: state.metaFacilitiesByKey,
      metaPeople: state.metaPeopleByKey,
      summaryFilter: state.summaryFilter,
    }),
    {fetchChanges}),
  callOnMount(function() { this.props.fetchChanges(); }),
  waitOnReady,
)(Changes);

export default ChangesContainer;
