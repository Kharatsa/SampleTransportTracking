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
    function() {
      this.props.fetchDateSummary();
      this.props.fetchSummary();
    }
  ),
  callOnProps(
    function(nextProps) {
      this.props.fetchDateSummary(nextProps.filter);
      this.props.fetchSummary(nextProps.filter);
    },
    function(nextProps) {
      return this.props.filter !== nextProps.filter;
    },
  )
)(() => null);

export default DashboardDataContainer;
