import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {App, Dashboard, Changes, Sample, MissingRoute} from './pages';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='changes(/:page)' component={Changes} />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='*' component={MissingRoute} />
  </Route>
);
