'use strict';

import {CHANGE_SUMMARY_FILTER} from '../actions/actions.js';
import {SummaryFilter} from '../api/records';
import Moment from 'moment';

const defaultAfterDate = Moment().subtract(1, 'months');
const defaultBeforeDate = Moment();

const defaultDateFilter = SummaryFilter({
  afterDate: defaultAfterDate,
  beforeDate: defaultBeforeDate
});

const summaryFilter = (state=defaultDateFilter, action) => {
  switch (action.type) {
  case CHANGE_SUMMARY_FILTER:
    return action.summaryFilter;
  default:
    return state;
  }
};

export default summaryFilter;
