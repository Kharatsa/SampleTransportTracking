import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {DateFilters} from '../components/DashboardControls';

export const DateFiltersContainer = connect(
  state => ({
    afterDateFilter: state.summaryFilter.get('afterDate', null),
    beforeDateFilter: state.summaryFilter.get('beforeDate', null)
  }),
  {changeSummaryFilter},
)(DateFilters);

export default DateFiltersContainer;
