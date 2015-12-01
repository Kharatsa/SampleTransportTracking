'use strict';

import request from '../util/request.js';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

// const FETCH_UPDATES = 'FETCH_UPDATES';
// const RECEIVE_UPDATES = 'RECEIVE_UPDATES';
export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export const FETCH_SAMPLES_FAILURE = 'FETCH_SAMPLES_FAILURE';
export const RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

/*
 * other constants
 */

/*
 * action creators
 */

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
