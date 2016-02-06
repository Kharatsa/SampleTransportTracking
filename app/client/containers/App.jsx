'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';
import * as actions from '../actions/actioncreators.js';
import Header from '../components/Header.jsx';

const App = React.createClass({

  render: function() {
    const {children, location} = this.props;
    const {push} = this.props.routeActions;

    return (
      <div>
        <Header changeRoute={push} location={location} />
        <div className='pure-g'>
          <div className='pure-u-1-24 sidebar'>left</div>
          <div className='pure-u-11-12'>
            {children}
          </div>
          <div className='pure-u-1-24 sidebar'>right</div>
        </div>
      </div>
    );
  }
});

// Wrap the component to inject dispatch and state into it
export default connect(
  state => (state),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    routeActions: bindActionCreators(routeActions, dispatch)
  })
)(App);

