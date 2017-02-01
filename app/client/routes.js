import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {
  App, Dashboard, Changes, Sample, Admin, MissingRoute,
  TATPage, LabTestsPage
} from './pages';
import {DEFAULT_AFTER_DATE, DEFAULT_BEFORE_DATE} from '../common/sttworkflow';
import {UserListPage, MetaListPage} from './pages/Admin';
import {
  makeLastQueryLoader, makeDefaultQueryLoader, saveQuery,
} from './util/router';
import {shortFormatDate} from './util/stringformat';

const DEFAULT_DATES = {
  after: shortFormatDate(DEFAULT_AFTER_DATE),
  before: shortFormatDate(DEFAULT_BEFORE_DATE),
};

const dashboardLoadQuery = makeLastQueryLoader(
  'after', 'before', 'lab', 'region',
);

const dashboardLoadDefaultQuery = makeDefaultQueryLoader({
  ...DEFAULT_DATES,
});

const changesLoadDefaultQuery = makeDefaultQueryLoader({
  ...DEFAULT_DATES, page: 1,
});

const makeOnEnter = (loadLast, loadDefault) => {
  return ({location}, replace, callback) => {
    const lastQuery = loadLast(location.query);
    const defaultQuery = loadDefault(location.query);

    if (lastQuery) {
      console.debug(`Loading ${JSON.stringify(lastQuery)} over ${JSON.stringify(location.query)}`)
      replace({
        pathname: location.pathname,
        query: lastQuery,
        state: location.state,
      });

    } else if (defaultQuery) {
      replace({
        pathname: location.pathname,
        query: defaultQuery,
        state: location.state,
      });
    }

    callback(null);
    return;
  };
};

const makeOnChange = loadLast => {
  return (prevState, nextState, replace, callback) => {
    const {location: prevLocation} = prevState;
    const {location} = nextState;
    console.debug(`Handling change from ${JSON.stringify(prevLocation)} to ${JSON.stringify(location)}`);

    if (location.action === 'PUSH') {
      const lastQuery = loadLast(location.query, prevLocation.query);
      if (lastQuery) {
        console.debug(`Loading ${JSON.stringify(lastQuery)} over ${JSON.stringify(location.query)}`)
        replace({
          pathname: location.pathname,
          query: lastQuery,
          state: location.state,
        });
      }

    }

    callback(null);
    return;
  };
};

const dashboardOnEnter = makeOnEnter(
  dashboardLoadQuery, dashboardLoadDefaultQuery
);

const dashboardOnChange = makeOnChange(dashboardLoadQuery);

const changesOnEnter = makeOnEnter(
  dashboardLoadQuery, changesLoadDefaultQuery,
);

export default (
  <Route path='/' component={App}>
    <IndexRoute
      component={Dashboard}
      onEnter={dashboardOnEnter}
      onChange={dashboardOnChange}
      onLeave={saveQuery}
    />
    <Route
      path='dashboard'
      component={Dashboard}
      onEnter={dashboardOnEnter}
      onChange={dashboardOnChange}
      onLeave={saveQuery}
    />
    <Route
      path='changes(/:page)'
      component={Changes}
      onEnter={changesOnEnter}
      onChange={dashboardOnChange}
      onLeave={saveQuery}
    />
    <Route
      path='tests'
      component={LabTestsPage}
      onEnter={dashboardOnEnter}
      onChange={dashboardOnChange}
      onLeave={saveQuery}
    />
    <Route
      path='tat'
      component={TATPage}
      onEnter={dashboardOnEnter}
      onChange={dashboardOnChange}
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
