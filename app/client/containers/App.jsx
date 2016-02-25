'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/actioncreators.js';
import Header from '../components/Header.jsx';

const App = React.createClass({
  componentWillMount() {
    const {fetchMetadata} = this.props.actions;
    fetchMetadata();
  },

  render() {
    const {children, location} = this.props;

    return (
      <div>
        <Header location={location} />
        <div id='main'>
          {children}
        </div>
      </div>
    );
  }
});

// Wrap the component to inject dispatch and state into it
export default connect(
  state => (state),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(App);

