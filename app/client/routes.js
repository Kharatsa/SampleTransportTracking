'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import {App, Summary, Changes, Sample, MissingRoute} from './pages';
import TestCharts from './components/TestCharts.jsx';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Summary} />
    <Route path='summary' component={Summary} />
    <Route path='changes(/:page)' component={Changes} />
    <Route path='samples(/:sampleId)' component={Sample} />
    <Route path='testchart' component={TestCharts} />
    <Route path='*' component={MissingRoute} />
  </Route>
);
