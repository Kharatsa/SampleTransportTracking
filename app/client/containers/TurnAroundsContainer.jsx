import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsTATReady} from '../selectors/uiselectors';
import {getStagesTATs, getEndToEndTAT} from '../selectors/dashboardselectors';
import TurnArounds from '../components/Dashboard/TurnArounds';
import {waitOnReady} from '../components/Utils';

export const TurnAroundsContainer = compose(
  connect(
    state => ({
      isReady: getIsTATReady(state),
      summaryFilter: state.summaryFilter,
      metaStages: state.metaStagesByKey,
      metaStatuses: state.metaStatusesByKey,
      turnArounds: state.summaryTurnArounds,
      stagesTATs: getStagesTATs(state),
      endToEndTAT: getEndToEndTAT(state)
    })),
  waitOnReady,
)(TurnArounds);

export default TurnAroundsContainer;
