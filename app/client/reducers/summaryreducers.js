import {combineReducers} from 'redux';
import {RECEIVE_SUMMARY} from '../actions/actions.js';
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

const summaryReducer = combineReducers({
  totals,
  artifacts,
  labTests
});

export default summaryReducer;
