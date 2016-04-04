import {CHANGE_SUMMARY_FILTER} from '../actions/actions';
import {SummaryFilter} from '../api/records';
import Moment from 'moment';

const defaultAfterDate = Moment().subtract(1, 'months');
const defaultBeforeDate = Moment();

const defaultSummaryFilter = SummaryFilter({
  afterDate: defaultAfterDate,
  beforeDate: defaultBeforeDate
});

export const summaryFilter = (state=defaultSummaryFilter, action) => {
  switch (action.type) {
  case CHANGE_SUMMARY_FILTER:
    return action.summaryFilter;
  default:
    return state;
  }
};
