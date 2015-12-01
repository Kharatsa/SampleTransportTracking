'use strict';

import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers/reducers.js';
import App from './containers/App.js';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  thunk, // lets us dispatch() functions
  logger // neat middleware that logs actions
)(createStore);

export const store = createStoreWithMiddleware(reducers);

const rootElement = document.getElementById('root');
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
