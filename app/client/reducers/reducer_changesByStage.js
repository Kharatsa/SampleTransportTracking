import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';
import {Map as ImmutableMap} from 'immutable';

export const changesByStage = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByStage;
  default:
    return state;
  }
};

export default changesByStage;
