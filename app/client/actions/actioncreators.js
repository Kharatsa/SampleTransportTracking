'use strict';

import {updatePath as routerUpdatePath} from 'redux-simple-router';
import {
    RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES
} from '../actions/actions.js';
import request from '../util/request.js';

/**
 * https://github.com/jlongster/redux-simple-router#updatepathpath-norouterupdate
 *
 * @param {String} path The current URL as a String
 * @param {Boolean} noRouterUpdate Signals a toggle to the router. Passing false
 *                                 will switch off all changes resulting from
 *                                 route updates until true is passed.
 */
export const updatePath = routerUpdatePath;

export function receiveTabs() {
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
