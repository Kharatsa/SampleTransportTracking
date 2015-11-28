'use strict';

import React, {createClass, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {store} from '../index.js';
import actions from '../actions/actions.js';

const App = createClass({
  componentDidMount: function() {
    this.props.fetchSamples();
  },

  render: function() {
    const {samples} = this.props;
    return (
      <div>
        Total samples: <span>{samples.size}</span>
        {samples.map(sample => <li key={sample.id}>{sample.stId}</li>)}
      </div>
    );
  }
});

App.propTypes = {
  isFetchingSamples: PropTypes.bool,
  samples: PropTypes.instanceOf(List)
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps() {
  return bindActionCreators(actions, store.dispatch);
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
// function select(state) {
//   return {
//     name: 'Sean James',
//   };
// }

// Wrap the component to inject dispatch and state into it
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
