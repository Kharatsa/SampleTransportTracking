import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchTurnArounds} from '../actions/actioncreators';
import {callOnMount, callOnPropChanged} from '../components/Utils';

export const TurnAroundsDataContainer = compose(
  connect(
    state => ({
      filter: state.summaryFilter,
    }),
    {fetchTurnArounds}),
  callOnMount(({fetchTurnArounds}) => fetchTurnArounds()),
  callOnPropChanged(
    ({filter}) => filter,
    (filter, {fetchTurnArounds}) => fetchTurnArounds(filter))
)(() => null);

export default TurnAroundsDataContainer;
