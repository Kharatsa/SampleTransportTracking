import {compose} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {changeSummaryFilter} from '../actions/actioncreators';
import {DateFilters} from '../components/DashboardControls';
import {
  callOnMount, callOnPropChanged, withAppRouter,
} from '../components/Utils';
import {queryValue, manyValues} from '../util/router';

const getDateQuery = manyValues(
  queryValue('after'),
  queryValue('before'),
);

const updateFromQuery = (
  {update, afterQuery, beforeQuery, afterDate, beforeDate}
) => {
  const changes = {};

  const after = moment(afterQuery);
  if (!after.isSame(afterDate, 'day')) {
    changes.afterDate = after;
  }

  const before = moment(beforeQuery);
  if (!before.isSame(beforeDate, 'day')) {
    changes.beforeDate = before;
  }

  if (Object.keys(changes).length) {
    update(changes);
  }
};

export const DateFiltersContainer = compose(
  connect(
    state => ({
      afterDate: state.summaryFilter.get('afterDate', null),
      beforeDate: state.summaryFilter.get('beforeDate', null)
    }),
    {changeSummaryFilter}),

  withAppRouter,

  callOnMount(
    ({router, afterDate, beforeDate, changeSummaryFilter}) => {
      const [afterQuery, beforeQuery] = getDateQuery(router);
      updateFromQuery({
        update: changeSummaryFilter,
        afterQuery,
        beforeQuery,
        afterDate,
        beforeDate});
    }),

  callOnPropChanged(
    ({router}) => getDateQuery(router),
    (
      [afterQuery, beforeQuery],
      {afterDate, beforeDate, changeSummaryFilter}
    ) => {
      updateFromQuery({
        update: changeSummaryFilter,
        afterQuery,
        beforeQuery,
        afterDate,
        beforeDate});
    }),

)(DateFilters);

export default DateFiltersContainer;
