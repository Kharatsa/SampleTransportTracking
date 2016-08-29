import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import store from './store';
import './util/memorystats';

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
