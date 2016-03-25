import { CHANGE_SUMMARY_FILTER } from '../actions/actions.js';
import { SummaryFilter } from '../api/records';
import Moment from 'moment';

const summaryFilter = (state=SummaryFilter({
  afterDate: Moment().subtract(1, 'months'),
  beforeDate: Moment()
}), action) => {
  switch (action.type) {
  case CHANGE_SUMMARY_FILTER:
    return action.summaryFilter;
  default:
    return state;
  }
};

export default summaryFilter;
