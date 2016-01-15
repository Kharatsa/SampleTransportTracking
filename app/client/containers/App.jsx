'use strict';

import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routeActions as routerActions} from 'redux-simple-router';
import {List, Map as ImmutableMap} from 'immutable';
import * as actions from '../actions/actioncreators.js';
import AppBar from 'material-ui/lib/app-bar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';

const appName = 'Sample Transport Tracking';

const App = React.createClass({
  propTypes: {
    isFetchingSamples: PropTypes.bool,
    samples: PropTypes.instanceOf(List),
    samplesById: PropTypes.instanceOf(ImmutableMap)
    // TODO: fix/re-enable this
    // routing: PropTypes.shape({
    //   path: PropTypes.string.isRequired
    // })
  },

  syncTabWithRoute: function() {
    // TODO: fix/re-enable this

    // const {selectedTab, tabsById, routing} = this.props;
    // const {selectTab} = this.props.actions;

    // Synchronize selectedTab to match the tab with a route matching the
    // current route, represented by routing.path
    // console.log('ROUTING', routing)
    // let activeTab = tabsById.filter((tab, tabId) => tab.route === routing.path);
    // if (activeTab && activeTab.first().route === selectedTab) {
      // selectTab(activeTab.keySeq().first());
    // }
  },

  handleTabClick: function(tabId) {
    const {tabsById} = this.props;
    const {selectTab} = this.props.actions;
    const {push} = this.props.routeActions;
    // const {push} = this.props.actions.routeActions;
    // const {selectTab, updatePath} = this.props.actions;
    let selected = tabsById.get(tabId);
    selectTab(tabId);
    push(selected.route);
    // updatePath(selected.route);
  },

  componentDidMount: function() {
    this.syncTabWithRoute();
  },

  render: function() {
    const {children, selectedTab} = this.props;

    return (
      <div>
        <Paper zDepth={1} rounded={false}>
          <AppBar zDepth={0} title={appName} showMenuIconButton={false} />
          <div>
            <Tabs onChange={this.handleTabClick} value={selectedTab}>
              <Tab label='Updates' value='0'></Tab>
              <Tab label='Samples' value='1'></Tab>
              <Tab label='Facilities' value='2'></Tab>
              <Tab label='Riders' value='3'></Tab>
            </Tabs>
          </div>
        </Paper>

        <div id='index' className='vcontainer'>
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
    actions: bindActionCreators(actions, dispatch),
    routeActions: bindActionCreators(routerActions, dispatch)
  })
)(App);

