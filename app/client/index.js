'use strict';

import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {Router, browserHistory} from 'react-router';
import {syncHistory} from 'redux-simple-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducers from './reducers/reducers.js';
import routes from './routes.js';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const reduxRouterMiddleware = syncHistory(browserHistory);
let createStoreWithMiddleware;
if (global.DEBUG) {
  const logger = createLogger();
  createStoreWithMiddleware = applyMiddleware(
    thunk, // lets us dispatch() functions
    reduxRouterMiddleware,
    logger // neat middleware that logs actions
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(
    thunk, // lets us dispatch() functions
    reduxRouterMiddleware
  )(createStore);
}

const store = createStoreWithMiddleware(reducers);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
