import {
  RECEIVE_CHANGES, FETCH_CHANGES, FETCH_CHANGES_FAILURE
} from '../actions/actions.js';
import {Page} from '../api/records.js';

const DEFAULT_TOTAL = 0;

export const paginationTotal = (state=DEFAULT_TOTAL, action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.count;
  default:
    return state;
  }
};

const DEFAULT_PER_PAGE = 50;

export const paginationPerPage = (state=DEFAULT_PER_PAGE) => (state);

const DEFAULT_PAGE = Page();

export const paginationPage = (state=DEFAULT_PAGE, action) => {
  switch (action.type) {
  case FETCH_CHANGES: {
    const pageNum = Number(action.page || 1);
    return Page({last: state.current, current: pageNum});
  }
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last});
  default:
    return state;
  }
};


