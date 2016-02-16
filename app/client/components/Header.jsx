'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HeaderLink from './HeaderLink.jsx';
import Link from 'react-router/lib/Link';

const appName = 'Kharatsa';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <div className='header'>
      <div className='pure-menu pure-menu-horizontal pure-menu-blackbg'>
        <Link to='/' className='pure-menu-heading pure-menu-link'>
          {appName}
        </Link>
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
