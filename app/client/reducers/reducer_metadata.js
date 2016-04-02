import {RECEIVE_METADATA} from '../actions/actions.js';
import {Map as ImmutableMap} from 'immutable';

const metadata = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_METADATA:
    return action.metadata;
  default:
    return state;
  }
};

export default metadata;
