import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';

export const changesTotal = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.count;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes.size;
  default:
    return state;
  }
};

export default changesTotal;
