'use strict';

import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import {List, Map as ImmutableMap} from 'immutable';
import {
    defaultTabsById, RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES
} from '../actions/actions.js';

const tabsById = function(state=defaultTabsById, action) {
  switch(action.type) {
    case RECEIVE_TABS:
      return action.tabs;
    default:
      return state;
  }
};

const defaultTabs = List([]);
const tabs = function(state=defaultTabs, action) {
    switch(action.type) {
    case RECEIVE_TABS:
      let allTabs = action.tabs;
      return List(allTabs.keys());
    default:
      return state;
  }
}

const isFetchingSamples = function(state=false, action) {
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

// const defaultRoutingState = ImmutableMap({
//   path: '\\'
// });
const updatePath = function updatePathReducer(state, action) {
  switch(action.type) {
    case UPDATE_PATH:
      console.debug(action);
      // do something here
    default:
      return state;
  }
}

const defaultTab= '0';
const selectedTab = function selectedTabReducer(state=defaultTab, action) {
  switch (action.type) {
    case SELECT_TAB:
      return action.tabId;
    default:
      return state;
  }
}

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
const samplesById = function sampleIdsReducer(state=defaultSamplesById, action) {
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
  tabs,
  tabsById,
  routing: routeReducer,
  selectedTab,
  isFetchingSamples,
  samples,
  samplesById
});
