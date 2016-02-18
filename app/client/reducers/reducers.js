'use strict';

import {combineReducers} from 'redux';
import {OrderedSet, Map as ImmutableMap} from 'immutable';
import {
    FETCHING_DATA,
    FETCH_CHANGES, FETCH_CHANGES_FAILURE,
    RECEIVE_SAMPLES, RECEIVE_CHANGES,
    RECEIVE_METADATA, CHANGE_WINDOW_SIZE
} from '../actions/actions.js';
import {WindowSize, Page} from '../api/records.js';

const isFetchingData = (state=false, action) => {
  switch (action.type) {
  case FETCHING_DATA:
    return action.isFetching;
  default:
    return state;
  }
};

const metadata = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_METADATA:
    return action.metadata;
  default:
    return state;
  }
};

const sampleIds = (state=OrderedSet(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return action.entities.sampleIds;
  case RECEIVE_CHANGES:
    return action.entities.samples.keySeq().toOrderedSet();
  default:
    return state;
  }
};

const samplesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLES:
    return action.samples;
  case RECEIVE_CHANGES:
    return action.entities.samples;
  default:
    return state;
  }
};

const changeIds = (state=OrderedSet(), action) => {
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
    return action.entities.changes;
  default:
    return state;
  }
};

const changesTotal = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.count;
  default:
    return state;
  }
};

const artifactIds = (state=OrderedSet(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.entities.artifacts.keySeq().toOrderedSet();
  default:
    return state;
  }
};

const artifactsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.entities.artifacts;
  default:
    return state;
  }
};

const labTestIds = (state=OrderedSet(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.entities.labTests.keySeq().toOrderedSet();
  default:
    return state;
  }
};

const labTestsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.entities.labTests;

  default:
    return state;
  }
};

const windowSize = (state=new WindowSize({}), action) => {
  switch (action.type) {
  case CHANGE_WINDOW_SIZE:
    return action.size;
  default:
    return state;
  }
};

const page = (state=Page({}), action) => {
  switch (action.type) {
  case FETCH_CHANGES:
    return Page({last: state.current, current: action.page});
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last});
  default:
    return state;
  }
};

export default combineReducers({
  page,
  windowSize,
  isFetchingData,
  metadata,
  sampleIds,
  samplesById,
  changeIds,
  changesById,
  changesTotal,
  artifactIds,
  artifactsById,
  labTestIds,
  labTestsById
});
