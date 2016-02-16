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
        <div className='pure-g'>
          <div className='pure-u-1-24 sidebar'></div>
          <div className='pure-u-11-12'>
            {children}
          </div>
          <div className='pure-u-1-24 sidebar'></div>
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

