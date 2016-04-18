import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {DateFilters} from '../components/DashboardControls';

export const DateFiltersContainer = connect(
  state => ({
    afterDateFilter: state.summaryFilter.get('afterDate', null),
    beforeDateFilter: state.summaryFilter.get('beforeDate', null)
  }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(DateFilters);

export default DateFiltersContainer;
