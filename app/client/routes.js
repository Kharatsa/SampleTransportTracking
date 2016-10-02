import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {App, Dashboard, Changes, Sample, Admin, MissingRoute} from './pages';
import {UserListPage, MetaListPage} from './pages/Admin';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='changes(/:page)' component={Changes} />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='admin' component={Admin}>
      <IndexRoute component={UserListPage} />
      <Route path='users/:userId' component={Admin}/>
      <Route path='users' component={UserListPage}/>
      <Route path='meta' component={MetaListPage}>
          <Route path=':type/:key' component={Admin} />
          <Route path=':type' component={Admin}>
        </Route>
      </Route>
    </Route>
    <Route path='*' component={MissingRoute} />
  </Route>
);
