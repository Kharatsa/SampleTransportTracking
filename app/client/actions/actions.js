'use strict';

import {Map as ImmutableMap} from 'immutable';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */
export const RECEIVE_TABS = 'RECEIVE_TABS';
export const SELECT_TAB = 'SELECT_TAB';

export const FETCH_UPDATES = 'FETCH_UPDATES';
export const FETCH_UPDATES_FAILURE = 'FETCH_UPDATES_FAILURE';
export const RECEIVE_UPDATES = 'RECEIVE_UPDATES';

export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export const FETCH_SAMPLES_FAILURE = 'FETCH_SAMPLES_FAILURE';
export const RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

/*
 * other constants
 */
// TODO: Use records here
export const defaultTabsById = ImmutableMap({
  '0': {
    label: 'Updates',
    'route': '/'
  },
  '1': {
    name: 'Samples',
    route: '/samples'
  },
  '2': {
    name: 'Facilities',
    route: '/facilities'
  },
  '3': {
    name: 'Riders',
    route: 'riders'
  }
});
