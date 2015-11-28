'use strict';

import {combineReducers} from 'redux';
import {List} from 'immutable';
import {
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES
} from '../actions/actions.js';

/*

Store/State:
  updates/events
  samples
  origin location/facility
  current location/facility
 */

const isFetchingSamples = function fetchingReduer(state=false, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return false;
  case FETCH_SAMPLES:
    return true;
  case FETCH_SAMPLES_FAILURE:
    return false;
  default:
    return state;
  }
};

const defaultSamples = List([]);

const samples = function sampleReducer(state=defaultSamples, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return List(action.samples);
  default:
    return state;
  }
};

const rootReducer = combineReducers({isFetchingSamples, samples});
module.exports = rootReducer;
