import {
  CHANGE_WINDOW_SIZE, TOGGLE_MENU, FETCH_CHANGES, FETCH_CHANGES_FAILURE
} from '../actions/actions.js';
import {WindowSize, Page} from '../api/records.js';

export const menuOpen = (state=false, action) => {
  switch(action.type) {
  case TOGGLE_MENU:
    return !state;
  default:
    return state;
  }
};

export const windowSize = (state=new WindowSize({}), action) => {
  switch (action.type) {
  case CHANGE_WINDOW_SIZE:
    return action.size;
  default:
    return state;
  }
};

export const page = (state=Page({}), action) => {
  switch (action.type) {
  case FETCH_CHANGES:
    return Page({last: state.current, current: action.page});
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last});
  default:
    return state;
  }
};
