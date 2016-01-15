'use strict';

import {Map as ImmutableMap} from 'immutable';
// import {UPDATE_LOCATION as ROUTER_UPDATE_LOCATION} from 'redux-simple-router';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */
export const RECEIVE_TABS = 'RECEIVE_TABS';
// UPDATE_LOCATION via https://github.com/rackt/redux-simple-router#api
// export const UPDATE_LOCATION = ROUTER_UPDATE_LOCATION;
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
