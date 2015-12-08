'use strict';

import {updatePath as routerUpdatePath} from 'redux-simple-router';
import {
    RECEIVE_TABS, SELECT_TAB, UPDATE_PATH,
    FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
    FETCH_EVENTS, FETCH_EVENTS_FAILURE, RECEIVE_EVENTS
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

function requestEvents() {
  return {
    type: FETCH_EVENTS,
    requestedAt: Date.now()
  };
}

export function fetchEvents() {
  return function(dispatch) {
    dispatch(requestEvents());
    return request('/track/events', function(err, res) {
      if (err) {
        dispatch(fetchEventsFailure(err));
      }
      dispatch(receiveEvents(res.json));
    });
  }
}

function fetchEventsFailure(err) {
  return {
    type: FETCH_EVENTS_FAILURE,
    error: err
  };
}

function receiveEvents(events) {
  return {
    type: RECEIVE_EVENTS,
    events,
    receivedAt: Date.now()
  };
}