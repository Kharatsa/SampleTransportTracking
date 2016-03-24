import { RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL } from '../actions/actions.js';
import { Map as ImmutableMap } from 'immutable';

const samplesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.samples;
  default:
    return state;
  }
};

export default samplesById;
