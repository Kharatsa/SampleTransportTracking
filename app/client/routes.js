import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {
  App, Dashboard, Changes, Sample, Admin, MissingRoute,
  TATPage, LabTestsPage
} from './pages';
import {DEFAULT_AFTER_DATE, DEFAULT_BEFORE_DATE} from '../common/sttworkflow';
import {shortFormatDate} from './util/stringformat';
import {UserListPage, MetaListPage} from './pages/Admin';

/**
 * React-Router onChange
 * https://github.com/ReactTraining/react-router/blob/v3.0.0/docs/API.md#onchangeprevstate-nextstate-replace-callback
 * @callback onChange
 * @param {Object} prevState - Last react-router object
 * @param {Object} nextState - Current react-router object
 * @param {Function} replace
 * @param {Function} [callback]
 */

/**
 * Return onChange callback function which reincludes the specified query
 * keys from a previous state into the current state. This is useful for
 * preserving query keys between route transitions.
 * @param {string} ...keys
 * @returns {onChange}
 */
const forwardQuery = (...keys) => {
  const filterQuery = (query={}) => keys.reduce((filtered, key) => {
    const value = query[key];
    if (value) {
      filtered[key] = value;
    }
    return filtered;
  }, {});

  const missingForwarded = (source={}, target={}) => {
    return keys.some((key) => source[key] && !target[key]);
  };

  return ({location: prevLocation}, {location}, replace, callback) => {
    console.debug(`onChange from ${JSON.stringify(prevLocation)} to ${JSON.stringify(location)}`);
    if (missingForwarded(prevLocation.query, location.query)) {
      const forwarded = filterQuery(prevLocation.query);
      console.debug(`forwarding ${JSON.stringify(forwarded)}`);
      replace({
        pathname: location.pathname,
        query: Object.assign({}, forwarded, location.query),
        state: location.state,
      });
    }
    callback(null);
  };
};

let lastQuery = {};
const saveQuery = ({location}) => {
  console.debug(`Save query from location ${JSON.stringify(location)}`);
  const {query={}} = location;
  lastQuery = query;
};

/**
 * React-Router onEnter callback
 * https://github.com/ReactTraining/react-router/blob/v3.0.0/docs/API.md#onenternextstate-replace-callback
 * @callback onEnter
 * @param {Object} nextState - Current react-router object
 * @param {Function} replace
 * @param {Function} [callback]
 */

/**
 * Return onEnter callback function which either reincludes a saved query
 * or reincludes and missing default query parameters.
 * @param {Object} defaults
 * @returns {onEnter}
 */
const enterWithMissingDefaults = defaults => {
  const keys = Object.keys(defaults);

  const hasKeys = query => {
    return keys.some((key) => query[key] && defaults[key]);
  };

  const missingKeys = (lastQuery, query) => {
    return Object.keys(lastQuery).some((key) => !query[key]);
  };

  const missingDefault = query => {
    return keys.some((key) => !query[key]);
  };

  return ({location}, replace, callback) => {
    console.debug(`onEnter ${JSON.stringify(location)}`);

    // TODO(sean): probably wise to filter the keys captured here
    if (hasKeys(lastQuery) && missingKeys(lastQuery, location.query)) {
      // Load last query parameters
      console.debug(`Loading last query ${JSON.stringify(lastQuery)} over ${JSON.stringify(location.query)}`);
      replace({
        pathname: location.pathname,
        query: Object.assign({}, lastQuery, location.query),
        state: location.state,
      });
      lastQuery = {};

    } else if (missingDefault(location.query)) {
      // Load missing default query parameters
      console.debug(`Loading default query ${JSON.stringify(defaults)} over ${JSON.stringify(location.query)}`);
      replace({
        pathname: location.pathname,
        query: Object.assign({}, defaults, location.query),
        state: location.state,
      });

    }

    callback(null);
    return;
  };
};

const DEFAULT_DATES = {
  after: shortFormatDate(DEFAULT_AFTER_DATE),
  before: shortFormatDate(DEFAULT_BEFORE_DATE),
};

const dateDefaults = enterWithMissingDefaults({...DEFAULT_DATES});
const changesDefaults = enterWithMissingDefaults({...DEFAULT_DATES, page: 1});
const forwardDashboardQuery = forwardQuery('after', 'before',
                                           'lab', 'facility');

export default (
  <Route path='/' component={App}>
    <IndexRoute
      component={Dashboard}
      onEnter={dateDefaults}
      onChange={forwardDashboardQuery}
      onLeave={saveQuery}
    />
    <Route
      path='dashboard'
      component={Dashboard}
      onEnter={dateDefaults}
      onChange={forwardDashboardQuery}
      onLeave={saveQuery}
    />
    <Route
      path='changes(/:page)'
      component={Changes}
      onEnter={changesDefaults}
      onChange={forwardDashboardQuery}
      onLeave={saveQuery}
    />
    <Route
      path='tests'
      component={LabTestsPage}
      onEnter={dateDefaults}
      onChange={forwardDashboardQuery}
      onLeave={saveQuery}
    />
    <Route
      path='tat'
      component={TATPage}
      onEnter={dateDefaults}
      onChange={forwardDashboardQuery}
      onLeave={saveQuery}
    />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='admin' component={Admin}>
      <IndexRoute component={UserListPage} />
      <Route path='users/:userId' component={Admin}/>
      <Route path='users' component={UserListPage}/>
      <Route path='meta' component={MetaListPage}/>
      <Route path='meta/:type' component={MetaListPage}>
          <Route path=':key' component={Admin}/>
      </Route>
    </Route>
    <Route path='*' component={MissingRoute} />
  </Route>
);
