import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsChangesReady} from '../selectors/uiselectors';
import {getChangesDetail} from '../selectors/changes_selectors';
import Changes from '../components/Changes';
import {waitOnReady} from '../components/Utils';

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
    })),
  waitOnReady,
)(Changes);

export default ChangesContainer;
