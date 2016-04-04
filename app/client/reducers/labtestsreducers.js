import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';
import {Seq, Map as ImmutableMap} from 'immutable';

export const labTestIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.labTests.keySeq();
  default:
    return state;
  }
};

export const labTestsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.labTests;
  default:
    return state;
  }
};
