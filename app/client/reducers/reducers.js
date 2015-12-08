'use strict';

import {combineReducers} from 'redux';
import {routeReducer} from 'redux-simple-router';
import {List, Map as ImmutableMap} from 'immutable';
import {
    defaultTabsById, RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
    FETCH_EVENTS, FETCH_EVENTS_FAILURE, RECEIVE_EVENTS
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
      console.debug(action);
      // do something here
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
  case RECEIVE_EVENTS:
    return false;
  case FETCH_SAMPLES:
  case FETCH_EVENTS:
    return true;
  case FETCH_SAMPLES_FAILURE:
  case FETCH_EVENTS_FAILURE:
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
  let collection = collection || ImmutableMap;
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

const defaultEvents = List([]);
const events = function(state=defaultEvents, action) {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return listArrayItemsWithId(action.events);
    default:
      return state;
  }
};

const defaultEventsById = ImmutableMap({});
const eventsById = function(state=defaultEventsById, action) {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return transformArrayItemsWithId(action.events);
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
  events,
  eventsById,
  samples,
  samplesById
});
