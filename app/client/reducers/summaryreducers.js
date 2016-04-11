import {combineReducers} from 'redux';
import {RECEIVE_SUMMARY, RECEIVE_TURN_AROUNDS} from '../actions/actions.js';
import {SummaryTotal} from '../api/records';
import {Seq} from 'immutable';

const totals = (state=SummaryTotal({}), action) => {
  switch(action.type) {
  case RECEIVE_SUMMARY:
    return action.totals;
  default:
    return state;
  }
};

const artifacts = (state=Seq(), action) => {
  switch(action.type) {
  case RECEIVE_SUMMARY:
    return action.artifacts;
  default:
    return state;
  }
};

const labTests = (state=Seq(), action) => {
  switch(action.type) {
  case RECEIVE_SUMMARY:
    return action.labTests;
  default:
    return state;
  }
};

const turnArounds = (state=Seq(), action) => {
  switch(action.type) {
  case RECEIVE_TURN_AROUNDS:
    console.log('turn arounds in reducer: ', action.turnArounds);

    //server is 500'ing, which is causing this to error
    if (!action.turnArounds) {
      return Seq();
    }
    return action.turnArounds;
  default:
    return state;
  }
}

const summaryReducer = combineReducers({
  totals,
  artifacts,
  labTests,
  turnArounds
});

export default summaryReducer;
