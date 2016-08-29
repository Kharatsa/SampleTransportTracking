import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import store from './store';
import './util/memorystats';

if (process.env.NODE_ENV !== 'production') {
  const Perf = require('react-addons-perf');
  window.Perf = Perf;
}

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
