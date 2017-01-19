import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchDateSummary, fetchSummary} from '../actions/actioncreators';
import {callOnMount, callOnPropChanged} from '../components/Utils';

// TODO: get filter from router

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
  callOnPropChanged(
    ({filter}) => filter,
    (filter, {fetchDateSummary, fetchSummary}) => {
      fetchDateSummary(filter);
      fetchSummary(filter);
    }),
)(() => null);

export default DashboardDataContainer;
