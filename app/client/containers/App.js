'use strict';

var React = require('react');
var ReactRedux = require('react-redux');
var actions = require('../actions/actions.js');

var App = React.createClass({
  render: function() {
    console.debug('this.props', this.props);
    return <div>Hello {this.props.name}</div>;
  }
});

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    name: 'Sean James',
  };
}

// Wrap the component to inject dispatch and state into it
module.exports = ReactRedux.connect(select)(App);
