import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {App, Dashboard, Changes, Sample, Admin, MissingRoute} from './pages';
import {UsersPage} from './pages/Admin';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='changes(/:page)' component={Changes} />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='admin' component={Admin}>
      <IndexRoute component={UsersPage} />
      <Route path='users' component={UsersPage}>
        <Route path=':userId' component={Admin} />
      </Route>
      <Route path='meta' component={Admin}>
          <Route path=':type/:key' component={Admin} />
          <Route path=':type' component={Admin}>
        </Route>
      </Route>
    </Route>
    <Route path='*' component={MissingRoute} />
  </Route>
);
