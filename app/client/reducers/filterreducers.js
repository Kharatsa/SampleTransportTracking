import {CHANGE_SUMMARY_FILTER} from '../actions/actions';
import {SummaryFilter} from '../api/records';
import Moment from 'moment';

const defaultAfterDate = Moment().subtract(1, 'months');
const defaultBeforeDate = Moment();

const defaultSummaryFilter = SummaryFilter({
  afterDate: defaultAfterDate,
  beforeDate: defaultBeforeDate
});

const getFilterValue = (updated, existing, attr) => {
  const filterValue = updated.get(attr);
  if (typeof filterValue !== 'undefined') {
    return filterValue;
  }
  return existing.get(attr);
};

export const summaryFilter = (state=defaultSummaryFilter, action) => {
  switch (action.type) {
  case CHANGE_SUMMARY_FILTER: {
    const filter = action.summaryFilter;
    const updatedFilter = {
      afterDate: getFilterValue(filter, state, 'afterDate'),
      beforeDate: getFilterValue(filter, state, 'beforeDate'),
      regionKey: getFilterValue(filter, state, 'regionKey'),
      facilityKey: getFilterValue(filter, state, 'facilityKey'),
      loading: getFilterValue(filter, state, 'loading') || true,
    };
    return SummaryFilter(updatedFilter);
  }
  default:
    return state;
  }
};
