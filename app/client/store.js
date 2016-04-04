import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';
import DevTools from './components/DevTools';

let enhancer;
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  enhancer = compose(applyMiddleware(thunk, logger), DevTools.instrument());
} else {
  enhancer = applyMiddleware(thunk);
}

let initialState = {};
export default createStore(reducers, initialState, enhancer);
