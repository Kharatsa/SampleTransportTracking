'use strict';

import {combineReducers} from 'redux';
import {List, Map as ImmutableMap} from 'immutable';
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
    return List(action.samples.map(sample => sample.id));
  default:
    return state;
  }
};

const defaultSamplesById = ImmutableMap({});
const samplesById = function sIdReducer(state=defaultSamplesById, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return ImmutableMap(action.samples.reduce(function(previous, current) {
      previous[current.id] = current;
      return previous;
    }, {}));
  default:
    return state;
  }
};

export default combineReducers({
  isFetchingSamples,
  samples,
  samplesById
});
