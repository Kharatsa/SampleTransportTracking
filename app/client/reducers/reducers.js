'use strict';

import {combineReducers} from 'redux';
import {routeReducer} from 'react-router-redux';
import {List, Map as ImmutableMap} from 'immutable';
import {
    defaultTabsById, RECEIVE_TABS, SELECT_TAB,
    FETCH_SAMPLE_IDS, FETCH_SAMPLE_IDS_FAILURE, RECEIVE_SAMPLE_IDS,
    FETCH_UPDATES, FETCH_UPDATES_FAILURE, RECEIVE_UPDATES
} from '../actions/actions.js';

// TODO: Make Records from the objects

const tabsById = function(state=defaultTabsById, action) {
  switch (action.type) {
  case RECEIVE_TABS:
    return action.tabs;
  default:
    return state;
  }
};

const defaultTabs = List([]);
const tabs = function(state=defaultTabs, action) {
  switch (action.type) {
  case RECEIVE_TABS:
    let allTabs = action.tabs;
    return List(allTabs.keys());
  default:
    return state;
  }
};

const defaultTab = '0';
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
  case RECEIVE_SAMPLE_IDS:
  case RECEIVE_UPDATES:
    return false;
  case FETCH_SAMPLE_IDS:
  case FETCH_UPDATES:
    return true;
  case FETCH_SAMPLE_IDS_FAILURE:
  case FETCH_UPDATES_FAILURE:
    return false;
  default:
    return state;
  }
};

function listArrayItemsWithId(items) {
  return List(items.map(item => item.id));
}

const defaultSampleIds = List([]);
const sampleIds = function(state=defaultSampleIds, action) {
  switch (action.type) {
  case RECEIVE_SAMPLE_IDS:
    return listArrayItemsWithId(action.sampleIds);
    // return List(action.sampleIds.map(sampleId => sampleId.id));
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

const defaultSampleIdById = ImmutableMap({});
const samplesById = function(state=defaultSampleIdById, action) {
  switch (action.type) {
  case RECEIVE_SAMPLE_IDS:
    return transformArrayItemsWithId(action.sampleIds);
    // return ImmutableMap(action.sampleIds.reduce(function(previous, current) {
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
  sampleIds,
  samplesById
});
