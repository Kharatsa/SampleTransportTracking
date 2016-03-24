import { RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL } from '../actions/actions.js';
import { Map as ImmutableMap } from 'immutable';

const artifactsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.artifacts;
  default:
    return state;
  }
};

export default artifactsById;
