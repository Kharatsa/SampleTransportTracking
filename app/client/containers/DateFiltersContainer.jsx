import {compose} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {DateFilters} from '../components/DashboardControls';
import {withAppRouter} from '../components/Utils';

export const DateFiltersContainer = compose(
  connect(
    state => ({
      afterDate: state.summaryFilter.get('afterDate', null),
      beforeDate: state.summaryFilter.get('beforeDate', null)
    }),
    {changeSummaryFilter}),

  withAppRouter,

)(DateFilters);

export default DateFiltersContainer;
