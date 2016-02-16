'use strict';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

export const FETCHING_DATA = 'FETCHING_DATA';

export const FETCH_METADATA = 'FETCH_METADATA';
export const FETCH_METADATA_FAILURE = 'FETCH_METADATA_FAILURE';
export const RECEIVE_METADATA = 'RECEIVE_METADATA';

export const FETCH_CHANGES = 'FETCH_CHANGES';
export const FETCH_CHANGES_FAILURE = 'FETCH_CHANGES_FAILURE';
export const RECEIVE_CHANGES = 'RECEIVE_CHANGES';

export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export const FETCH_SAMPLES_FAILURE = 'FETCH_SAMPLES_FAILURE';
export const RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

export const CHANGE_WINDOW_SIZE = 'CHANGE_WINDOW_SIZE';

/*
 * other constants
 */
