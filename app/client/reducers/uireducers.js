import * as actions from '../actions/actions.js';

export const isFetchingData = (state=false, action) => {
  switch (action.type) {
  case actions.FETCH_CHANGES:
  case actions.FETCH_SAMPLE_DETAIL:
  case actions.FETCH_SUMMARY:
    return true;
  case actions.FETCH_CHANGES_FAILURE:
  case actions.FETCH_SAMPLE_DETAIL_FAILURE:
  case actions.FETCH_SUMMARY_FAILURE:
  case actions.RECEIVE_CHANGES:
  case actions.RECEIVE_SAMPLE_DETAIL:
  case actions.RECEIVE_SUMMARY:
    return false;
  default:
    return state;
  }
};

export const isFetchingMetadata = (state=false, action) => {
  switch (action.type) {
  case actions.FETCH_METADATA:
    return true;
  case actions.FETCH_METADATA_FAILURE:
  case actions.RECEIVE_METADATA: {
    return false;
  }
  default:
    return state;
  }
};
