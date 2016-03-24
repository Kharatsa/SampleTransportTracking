import { RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL } from '../actions/actions.js';
import { Seq } from 'immutable';

const changeIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changeIds;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes.keySeq();
  default:
    return state;
  }
};

export default changeIds;
