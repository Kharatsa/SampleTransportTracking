import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {App, Dashboard, Changes, Sample, MissingRoute} from './pages';
import TestPage from './components/TestPage';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Dashboard} />
    <Route path='summary' component={Dashboard} />
    <Route path='changes(/:page)' component={Changes} />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='test' component={TestPage} />
    <Route path='*' component={MissingRoute} />
  </Route>
);
