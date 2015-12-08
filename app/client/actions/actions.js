'use strict';

import {Map as ImmutableMap} from 'immutable';
import {UPDATE_PATH as ROUTER_UPDATE_PATH, updatePath as routerUpdatePath} from 'redux-simple-router';
import request from '../util/request.js';

// https://github.com/acdlite/flux-standard-action
// http://rackt.org/redux/docs/basics/Actions.html

/*
 * action types
 */

/*
 * https://github.com/jlongster/redux-simple-router#update_path
 */
export const RECEIVE_TABS = 'RECEIVE_TABS';
export const UPDATE_PATH = ROUTER_UPDATE_PATH;
export const SELECT_TAB = 'SELECT_TAB';

export const FETCH_EVENTS = 'FETCH_EVENTS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';

export const FETCH_SAMPLES = 'FETCH_SAMPLES';
export const FETCH_SAMPLES_FAILURE = 'FETCH_SAMPLES_FAILURE';
export const RECEIVE_SAMPLES = 'RECEIVE_SAMPLES';

/*
 * other constants
 */

export const defaultTabsById = ImmutableMap({
  '0': {
    label: 'Events',
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
