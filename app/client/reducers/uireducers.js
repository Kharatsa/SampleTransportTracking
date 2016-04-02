import {
  CHANGE_WINDOW_SIZE, TOGGLE_MENU
} from '../actions/actions.js';
import {WindowSize} from '../api/records.js';

export const menuOpen = (state=false, action) => {
  switch(action.type) {
  case TOGGLE_MENU:
    return !state;
  default:
    return state;
  }
};

export const windowSize = (state=new WindowSize({}), action) => {
  switch (action.type) {
  case CHANGE_WINDOW_SIZE:
    return action.size;
  default:
    return state;
  }
};
