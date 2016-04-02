import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';
import {Map as ImmutableMap} from 'immutable';

export const changesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changes;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes;
  default:
    return state;
  }
};

export default changesById;
