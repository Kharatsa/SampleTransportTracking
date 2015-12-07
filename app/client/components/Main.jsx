'use strict';

import React, {createClass, PropTypes} from 'react';
import MaterialUpgradeMixin from './MaterialUpgradeMixin.jsx';
// import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Tab from './Tab.jsx';

const appName = 'Sample Transport Tracking';

export default React.createClass({
  mixins: [MaterialUpgradeMixin],

  render: function() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{appName}</span>
          </div>
          <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
            <Tab href="#scroll-tab-1" title={'tab 1'} active></Tab>
            <Tab href="#scroll-tab-2" title={'tab 2'}></Tab>
            <Tab href="#scroll-tab-3" title={'tab 3'}></Tab>
            <Tab href="#scroll-tab-4" title={'tab 4'}></Tab>
            <Tab href="#scroll-tab-5" title={'tab 5'}></Tab>
          </div>
        </header>

        <main className="mdl-layout__content">
          <section className="mdl-layout__tab-panel" id="scroll-tab-1">
            <div className="page-content">Test 1</div>
          </section>
          <section className="mdl-layout__tab-panel" id="scroll-tab-2">
            <div className="page-content">Test 2</div>
          </section>
          <section className="mdl-layout__tab-panel" id="scroll-tab-3">
            <div className="page-content">Test 3</div>
          </section>
          <section className="mdl-layout__tab-panel" id="scroll-tab-4">
            <div className="page-content">Test 4</div>
          </section>
          <section className="mdl-layout__tab-panel" id="scroll-tab-5">
            <div className="page-content">Test 5</div>
          </section>
        </main>

        <Footer></Footer>
      </div>
    );
  }
});
