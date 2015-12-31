'use strict';

import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import {List, Map as ImmutableMap} from 'immutable';
import {
    defaultTabsById, RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
    FETCH_UPDATES, FETCH_UPDATES_FAILURE, RECEIVE_UPDATES
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
};

const updatePath = function(state, action) {
  switch(action.type) {
  case UPDATE_PATH:
    // do something here
    return state;
  default:
    return state;
  }
};

const defaultTab= '0';
const selectedTab = function(state=defaultTab, action) {
  switch (action.type) {
  case SELECT_TAB:
    return action.tabId;
  default:
    return state;
  }
};

const isFetchingData = function(state=false, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
  case RECEIVE_UPDATES:
    return false;
  case FETCH_SAMPLES:
  case FETCH_UPDATES:
    return true;
  case FETCH_SAMPLES_FAILURE:
  case FETCH_UPDATES_FAILURE:
    return false;
  default:
    return state;
  }
};

function listArrayItemsWithId(items) {
  return List(items.map(item => item.id));
}

const defaultSamples = List([]);
const samples = function(state=defaultSamples, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return listArrayItemsWithId(action.samples);
    // return List(action.samples.map(sample => sample.id));
  default:
    return state;
  }
};

function transformArrayItemsWithId(items, _collection) {
  let collection = _collection || ImmutableMap;
  return collection(items.reduce(function(previous, current) {
    previous[current.id] = current;
    return previous;
  }, {}));
}

const defaultSamplesById = ImmutableMap({});
const samplesById = function(state=defaultSamplesById, action) {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return transformArrayItemsWithId(action.samples);
    // return ImmutableMap(action.samples.reduce(function(previous, current) {
    //   previous[current.id] = current;
    //   return previous;
    // }, {}));
  default:
    return state;
  }
};

const defaultUpdates = List([]);
const updates = function(state=defaultUpdates, action) {
  switch (action.type) {
  case RECEIVE_UPDATES:
    return listArrayItemsWithId(action.updates);
  default:
    return state;
  }
};

const defaultUpdatesById = ImmutableMap({});
const updatesById = function(state=defaultUpdatesById, action) {
  switch (action.type) {
  case RECEIVE_UPDATES:
    return transformArrayItemsWithId(action.updates);
  default:
    return state;
  }
};

export default combineReducers({
  routing: routeReducer,
  tabs,
  tabsById,
  selectedTab,
  isFetchingData,
  updates,
  updatesById,
  samples,
  samplesById
});
