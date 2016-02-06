'use strict';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

export const FETCHING_DATA = 'FETCHING_DATA';

export const FETCH_CHANGES = 'FETCH_CHANGES';
export const FETCH_CHANGES_FAILURE = 'FETCH_CHANGES_FAILURE';
export const RECEIVE_CHANGES = 'RECEIVE_CHANGES';

export const RECEIVE_ARTIFACTS = 'RECEIVE_ARTIFACTS';
export const RECEIVE_LAB_TESTS = 'RECEIVE_LAB_TESTS';

export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export const FETCH_SAMPLES_FAILURE = 'FETCH_SAMPLES_FAILURE';
export const RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

/*
 * other constants
 */
