import {
  RECEIVE_CHANGES, CHANGE_PAGE, FETCH_CHANGES, FETCH_CHANGES_FAILURE,
} from '../actions/actions.js';
import {Page} from '../api/records.js';

export const paginationTotal = (state=0, action) => {
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
  case CHANGE_PAGE:
    return Page({current: action.pageNum, last: state.current});
  case FETCH_CHANGES:
    return Page({current: action.page, last: state.current});
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last, last: null});
  default:
    return state;
  }
};
