import { RECEIVE_SAMPLE_DETAIL } from '../actions/actions.js';

const selectedSampleId = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return action.sampleId;
  default:
    return state;
  }
};

export default selectedSampleId;
