import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root.jsx';
import store from './store.js';

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
