import { CHANGE_WINDOW_SIZE } from '../actions/actions.js';
import { WindowSize } from '../api/records.js';

const windowSize = (state=new WindowSize({}), action) => {
  switch (action.type) {
  case CHANGE_WINDOW_SIZE:
    return action.size;
  default:
    return state;
  }
};

export default windowSize;
