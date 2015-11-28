'use strict';

import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers/reducers.js';

const logger = createLogger();
exports.logger = logger;

const createStoreWithMiddleware = applyMiddleware(
  thunk, // lets us dispatch() functions
  logger // neat middleware that logs actions
)(createStore);

const store = createStoreWithMiddleware(reducers);
exports.store = store;

const App = require('./containers/App.js');

const rootElement = document.getElementById('root');
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
