import { FETCH_CHANGES, FETCH_CHANGES_FAILURE } from '../actions/actions.js';
import { Page } from '../api/records.js';

const page = (state=Page({}), action) => {
  switch (action.type) {
  case FETCH_CHANGES:
    return Page({last: state.current, current: action.page});
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last});
  default:
    return state;
  }
};

export default page;
