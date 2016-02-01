'use strict';

import {
    RECEIVE_TABS, SELECT_TAB,
    FETCH_SAMPLE_IDS, FETCH_SAMPLE_IDS_FAILURE, RECEIVE_SAMPLE_IDS,
    FETCH_UPDATES, FETCH_UPDATES_FAILURE, RECEIVE_UPDATES
} from '../actions/actions.js';
import request from '../util/request.js';

export function receiveTabs(tabs) {
  return {
    type: RECEIVE_TABS,
    tabs
  };
}

export function selectTab(tabId) {
  return {
    type: SELECT_TAB,
    tabId
  };
}

function requestSampleIds() {
  return {
    type: FETCH_SAMPLE_IDS,
    requestedAt: Date.now()
  };
}

export function fetchSampleIds() {
  return function(dispatch) {
    dispatch(requestSampleIds());
    return request('/stt/ids', function(err, res) {
      if (err) {
        return dispatch(fetchSampleIdsFailure(err));
      }
      dispatch(receiveSampleIds(res.json));
    });
  };
}

function fetchSampleIdsFailure(err) {
  return {
    type: FETCH_SAMPLE_IDS_FAILURE,
    error: err
  };
}

function receiveSampleIds(sampleIds) {
  return {
    type: RECEIVE_SAMPLE_IDS,
    sampleIds,
    receivedAt: Date.now()
  };
}

function requestUpdates() {
  return {
    type: FETCH_UPDATES,
    requestedAt: Date.now()
  };
}

export function fetchUpdates() {
  return function(dispatch) {
    dispatch(requestUpdates());
    return request('/stt/changes', function(err, res) {
      if (err) {
        dispatch(fetchUpdatesFailure(err));
      }
      dispatch(receiveUpdates(res.json));
    });
  };
}

function fetchUpdatesFailure(err) {
  return {
    type: FETCH_UPDATES_FAILURE,
    error: err
  };
}

function receiveUpdates(updates) {
  return {
    type: RECEIVE_UPDATES,
    updates,
    receivedAt: Date.now()
  };
}
