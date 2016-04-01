'use strict';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

export const FETCH_METADATA = 'FETCH_METADATA';
export const FETCH_METADATA_FAILURE = 'FETCH_METADATA_FAILURE';
export const RECEIVE_METADATA = 'RECEIVE_METADATA';

export const FETCH_CHANGES = 'FETCH_CHANGES';
export const FETCH_CHANGES_FAILURE = 'FETCH_CHANGES_FAILURE';
export const RECEIVE_CHANGES = 'RECEIVE_CHANGES';

// export const FETCH_SAMPLE_LIST = 'FETCH_SAMPLE_LIST';
// export const FETCH_SAMPLE_LIST_FAILURE = 'FETCH_SAMPLE_LIST_FAILURE';
// export const RECEIVE_SAMPLE_LIST = 'RECEIVE_SAMPLE_LIST';

export const FETCH_SAMPLE_DETAIL = 'FETCH_SAMPLE_DETAIL';
export const FETCH_SAMPLE_DETAIL_FAILURE = 'FETCH_SAMPLE_DETAIL_FAILURE';
export const RECEIVE_SAMPLE_DETAIL = 'RECEIVE_SAMPLE_DETAIL';

export const FETCH_SUMMARY = 'FETCH_SUMMARY';
export const FETCH_SUMMARY_FAILURE = 'FETCH_SUMMARY_FAILURE';
export const RECEIVE_SUMMARY = 'RECEIVE_SUMMARY';

export const CHANGE_WINDOW_SIZE = 'CHANGE_WINDOW_SIZE';

export const CHANGE_SUMMARY_FILTER = 'CHANGE_SUMMARY_FILTER';

/*
 * other constants
 */
