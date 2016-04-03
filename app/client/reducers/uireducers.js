import {
  CHANGE_WINDOW_SIZE, TOGGLE_MENU,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
  FETCH_SUMMARY, FETCH_SUMMARY_FAILURE, RECEIVE_SUMMARY
} from '../actions/actions.js';
import {WindowSize} from '../api/records.js';

export const isFetchingData = (state=true, action) => {
  switch (action.type) {
  case FETCH_CHANGES:
  case FETCH_SAMPLE_DETAIL:
  case FETCH_SUMMARY:
    return true;
  case FETCH_CHANGES_FAILURE:
  case FETCH_SAMPLE_DETAIL_FAILURE:
  case FETCH_SUMMARY_FAILURE:
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
  case RECEIVE_SUMMARY:
    return false;
  default:
    return state;
  }
};

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
