import { CHANGE_SUMMARY_FILTER } from '../actions/actions.js';
import { SummaryFilter } from '../api/records';

const summaryFilter = (state=SummaryFilter({}), action) => {
  console.log('summary filter action: ', action)
  switch (action.type) {
  case CHANGE_SUMMARY_FILTER:
    return action.summaryFilter;
  default:
    return state;
  }
};

export default summaryFilter;
