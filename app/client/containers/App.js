'use strict';

var React = require('react');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var store = require('../index.js').store;
var STActions = require('../actions/actions.js');

var App = React.createClass({
  render: function() {
    console.debug('this.props', this.props);
    return <div>Hello Sean</div>;
  }
});

function mapStateToProps(state) {
  return {
    samples: state.samples
  };
}

function mapDispatchToProps() {
  return Redux.bindActionCreators(STActions, store.dispatch);
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
// function select(state) {
//   return {
//     name: 'Sean James',
//   };
// }

// Wrap the component to inject dispatch and state into it
module.exports = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
