'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Provider = require('react-redux').Provider;
var sttReducer = require('./reducers/reducers.js');

var store = redux.createStore(sttReducer);
exports.store = store;

var App = require('./containers/App.js');

var rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
