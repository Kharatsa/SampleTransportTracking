import {
    FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
    FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL
  } from '../actions/actions.js';

const isFetchingData = (state=true, action) => {
  switch (action.type) {
  case FETCH_CHANGES:
  case FETCH_SAMPLE_DETAIL:
    return true;
  case FETCH_CHANGES_FAILURE:
  case FETCH_SAMPLE_DETAIL_FAILURE:
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return false;
  default:
    return state;
  }
};

export default isFetchingData;
