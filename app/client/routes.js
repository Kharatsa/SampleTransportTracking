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

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Changes}/>
    <Route path='samples' component={Samples}/>
    <Route path='facilities' component={Facilities}/>
    <Route path='riders' component={Riders}/>
    <Route path='*' component={MissingRoute} />
  </Route>
);
