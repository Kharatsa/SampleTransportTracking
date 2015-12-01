'use strict';

import React, {createClass, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {store} from '../index.js';
import * as actions from '../actions/actions.js';

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

// Wrap the component to inject dispatch and state into it
// module.exports = connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(mapStateToProps, mapDispatchToProps)(App);
