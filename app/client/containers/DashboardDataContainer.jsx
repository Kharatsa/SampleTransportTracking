import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchDateSummary, fetchSummary} from '../actions/actioncreators';
import {callOnMount, callOnProps} from '../components/Utils';

export const DashboardDataContainer = compose(
  connect(
    state => ({
      filter: state.summaryFilter,
    }),
    {fetchDateSummary, fetchSummary},
  ),
  callOnMount(
    ({fetchDateSummary, fetchSummary}) => {
      fetchDateSummary();
      fetchSummary();
    }),
  callOnProps(
    ({fetchDateSummary, fetchSummary}, {filter}) => {
      fetchDateSummary(filter);
      fetchSummary(filter);
    },
    ({filter}, {filter: nextFilter}) => filter !== nextFilter,
  )
)(() => null);

export default DashboardDataContainer;
