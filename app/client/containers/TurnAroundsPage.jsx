import {connect} from 'react-redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {getStagesTATs, getEndToEndTAT} from '../selectors/dashboardselectors';
import TurnArounds from '../components/Dashboard/TurnArounds';
import TabPages from '../components/TabPages';

export const TurnAroundsPage = connect(
  state => ({
    isLoading: getIsLoading(state),
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    turnArounds: state.summaryTurnArounds,
    stagesTATs: getStagesTATs(state),
    endToEndTAT: getEndToEndTAT(state)
  }),
  {fetchTurnArounds},
)(TabPages);

export default TurnAroundsPage;