import {RECEIVE_SAMPLE_DETAIL, RECEIVE_CHANGES} from '../actions/actions.js';
import {Seq, Map as ImmutableMap} from 'immutable';

export const sampleIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return Seq([action.sampleId]);
  case RECEIVE_CHANGES:
    return action.samples.keySeq();
  default:
    return state;
  }
};

export const samplesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.samples;
  default:
    return state;
  }
};

export const selectedSampleId = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return action.sampleId;
  default:
    return state;
  }
};

