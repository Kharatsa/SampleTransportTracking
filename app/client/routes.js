'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from './containers/App.jsx';
import Changes from './containers/Changes.jsx';
import Samples from './containers/Samples.jsx';
import Facilities from './containers/Facilities.jsx';
import Riders from './containers/Riders.jsx';
import MissingRoute from './containers/MissingRoute.jsx';
import TestCharts from './components/TestCharts.jsx';
import SummaryView from './containers/Summary/SummaryView.jsx';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={SummaryView}/>
    <Route path='changes(/:page)' component={Changes}/>
    <Route path='samples(/:sampleId)' component={Samples}/>
    <Route path='facilities' component={Facilities}/>
    <Route path='riders' component={Riders}/>
    <Route path='testchart' component={TestCharts}/>
    <Route path='*' component={MissingRoute} />
  </Route>
);
