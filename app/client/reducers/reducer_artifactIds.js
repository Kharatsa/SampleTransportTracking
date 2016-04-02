import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';
import {Seq} from 'immutable';

export const artifactIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.artifacts.keySeq();
  default:
    return state;
  }
};

export default artifactIds;
