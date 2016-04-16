import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import TurnArounds from '../components/Summary/TurnArounds';

export const TurnAroundsContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metadata: state.metadata,
    turnArounds: state.summaryTurnArounds
  }),
  dispatch => ({actions: bindActionCreators({fetchTurnArounds}, dispatch)})
)(TurnArounds);

export default TurnAroundsContainer;
