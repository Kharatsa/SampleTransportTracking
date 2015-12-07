'use strict';

import React, {createClass, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {List, Map as ImmutableMap} from 'immutable';
import {store} from '../index.js';
import * as actions from '../actions/actions.js';
import Main from '../components/Main.jsx';
// import AllEvents from '../components/AllEvents.jsx';

const App = createClass({
  componentDidMount: function() {
    this.props.fetchSamples();
  },

        // <AllEvents samples = {samples} samplesById={samplesById}>
        // </AllEvents>
  render: function() {
    const {samplesById, samples} = this.props;
    return (
      <div>
        <Main></Main>
      </div>
    );
  }
});

App.propTypes = {
  isFetchingSamples: PropTypes.bool,
  samples: PropTypes.instanceOf(List),
  samplesById: PropTypes.instanceOf(ImmutableMap)
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
