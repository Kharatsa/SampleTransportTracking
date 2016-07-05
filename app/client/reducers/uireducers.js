import {
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
  FETCH_SUMMARY, FETCH_SUMMARY_FAILURE, RECEIVE_SUMMARY,
  FETCH_METADATA, FETCH_METADATA_FAILURE, RECEIVE_METADATA
} from '../actions/actions.js';

export const isFetchingData = (state=false, action) => {
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

export const isFetchingMetadata = (state=false, action) => {
  switch (action.type) {
    case FETCH_METADATA:
      return true;
    case FETCH_METADATA_FAILURE:
    case RECEIVE_METADATA: {
      return false;
    }
    default:
      return state;
  }
};
