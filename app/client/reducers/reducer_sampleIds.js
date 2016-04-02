import {RECEIVE_SAMPLE_DETAIL, RECEIVE_CHANGES} from '../actions/actions.js';
import {Seq} from 'immutable';

const sampleIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return Seq([action.sampleId]);
  case RECEIVE_CHANGES:
    return action.samples.keySeq();
  default:
    return state;
  }
};

export default sampleIds;
