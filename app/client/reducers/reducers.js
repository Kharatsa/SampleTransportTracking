'use strict';

import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';
import {Set as ImmutableSet, Map as ImmutableMap} from 'immutable';
import {
    FETCHING_DATA, RECEIVE_SAMPLES, RECEIVE_CHANGES
} from '../actions/actions.js';

const isFetchingData = (state=false, action) => {
  switch (action.type) {
  case FETCHING_DATA:
    return action.isFetching;
  default:
    return state;
  }
};

const samples = (state=ImmutableSet(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return action.samples;
  default:
    return state;
  }
};

const samplesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return action.sampleIds;
  default:
    return state;
  }
};

const changes = (state=ImmutableSet(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changeIds;
  default:
    return state;
  }
};

const changesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changes;
  default:
    return state;
  }
};

export default combineReducers({
  routing: routeReducer,
  isFetchingData,
  changes,
  changesById,
  samples,
  samplesById
});
