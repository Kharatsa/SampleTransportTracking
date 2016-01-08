'use strict';

import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {createHistory} from 'history';
import {Router} from 'react-router';
import {syncReduxAndRouter} from 'redux-simple-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import reducers from './reducers/reducers.js';
import routes from './routes.js';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let createStoreWithMiddleware;
if (global.DEBUG) {
  const logger = createLogger();
  createStoreWithMiddleware = applyMiddleware(
    thunk, // lets us dispatch() functions
    logger // neat middleware that logs actions
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(
    thunk // lets us dispatch() functions
  )(createStore);
}

const store = createStoreWithMiddleware(reducers);
const history = createHistory();
syncReduxAndRouter(history, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
