'use strict';

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers/reducers.js';
import DevTools from './containers/DevTools.jsx';

let enhancer;
// let createStoreWithMiddleware;
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  enhancer = compose(applyMiddleware(thunk, logger), DevTools.instrument());
  // createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
} else {
  enhancer = applyMiddleware(thunk);
  // createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
}

let initialState = {};
export default createStore(reducers, initialState, enhancer);

// export default createStoreWithMiddleware(reducers);
