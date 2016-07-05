import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {getStagesTATs, getEndToEndTAT} from '../selectors/dashboardselectors';
import TurnArounds from '../components/Dashboard/TurnArounds';

export const TurnAroundsContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    turnArounds: state.summaryTurnArounds,
    stagesTATs: getStagesTATs(state),
    endToEndTAT: getEndToEndTAT(state)
  }),
  dispatch => ({actions: bindActionCreators({fetchTurnArounds}, dispatch)})
)(TurnArounds);

export default TurnAroundsContainer;
