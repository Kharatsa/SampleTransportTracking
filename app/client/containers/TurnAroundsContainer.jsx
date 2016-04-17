import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import TurnArounds from '../components/Dashboard/TurnArounds';

export const TurnAroundsContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    metaStatuses: state.metaStatusesByKey,
    turnArounds: state.summaryTurnArounds
  }),
  dispatch => ({actions: bindActionCreators({fetchTurnArounds}, dispatch)})
)(TurnArounds);

export default TurnAroundsContainer;
