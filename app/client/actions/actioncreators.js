'use strict';

import {updatePath as routerUpdatePath} from 'redux-simple-router';
import {
    RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
    FETCH_UPDATES, FETCH_UPDATES_FAILURE, RECEIVE_UPDATES
} from '../actions/actions.js';
import request from '../util/request.js';

/**
 * https://github.com/jlongster/redux-simple-router#updatepathpath-norouterupdate
 *
 * @param {string} path The current URL as a String
 * @param {boolean} noRouterUpdate Signals a toggle to the router. Passing false
 *                                 will switch off all changes resulting from
 *                                 route updates until true is passed.
 */
export const updatePath = routerUpdatePath;

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

function requestSamples() {
  return {
    type: FETCH_SAMPLES,
    requestedAt: Date.now()
  };
}

export function fetchSamples() {
  return function(dispatch) {
    dispatch(requestSamples());
    return request('/track/ids', function(err, res) {
      if (err) {
        return dispatch(fetchSamplesFailure(err));
      }
      dispatch(receiveSamples(res.json));
    });
  };
}

function fetchSamplesFailure(err) {
  return {
    type: FETCH_SAMPLES_FAILURE,
    error: err
  };
}

function receiveSamples(samples) {
  return {
    type: RECEIVE_SAMPLES,
    samples,
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
    return request('/track/updates', function(err, res) {
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
