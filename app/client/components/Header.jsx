'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HeaderLink from './HeaderLink.jsx';

// const appName = 'Sample Transport Tracking';

export default React.createClass({
  mixins: [PureRenderMixin],
  // propTypes: {},

  // syncTabWithRoute: function() {
  //   TODO: fix/re-enable this

  //   const {selectedTab, tabsById, routing} = this.props;
  //   const {selectTab} = this.props.actions;

  //   Synchronize selectedTab to match the tab with a route matching the
  //   current route, represented by routing.path
  //   console.log('ROUTING', routing)
  //   let activeTab = tabsById.filter((tab, tabId) => tab.route === routing.path);
  //   if (activeTab && activeTab.first().route === selectedTab) {
  //     selectTab(activeTab.keySeq().first());
  //   }
  // },

  // handleTabClick: function(tabId) {
  //   const {tabsById} = this.props;
  //   const {selectTab} = this.props.actions;
  //   const {push} = this.props.routeActions;
  //   // const {push} = this.props.actions.routeActions;
  //   // const {selectTab, updatePath} = this.props.actions;
  //   let selected = tabsById.get(tabId);
  //   selectTab(tabId);
  //   push(selected.route);
  //   // updatePath(selected.route);
  // },

  // componentDidMount: function() {
  //   this.syncTabWithRoute();
  // },

  render: function() {
    return (
      <div className='header'>
      <div className='pure-menu pure-menu-horizontal pure-menu-blackbg'>
        <a href='/' className='pure-menu-heading pure-menu-link'>Kharatsa</a>
        <ul className='pure-menu-list'>
          <HeaderLink {...this.props} route='/' text='Changes' />
          <HeaderLink {...this.props} route='/samples' text='Samples' />
          <HeaderLink {...this.props} route='/facilities' text='Facilities' />
          <HeaderLink {...this.props} route='/riders' text='Riders' />
        </ul>
      </div>
    </div>
    );
  }
});
