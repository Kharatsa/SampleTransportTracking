'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import HeaderLink from './HeaderLink.jsx';
import Link from 'react-router/lib/Link';

const appName = 'Kharatsa';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    const {location} = this.props;

    return (
      <div className='header'>
      <div className='pure-menu pure-menu-horizontal pure-menu-blackbg'>
        <Link to='/' className='pure-menu-heading pure-menu-link'>
          {appName}
        </Link>
        <ul className='pure-menu-list'>
          <HeaderLink
            linkTo='/'
            location={location}
            matchRoutes={['/', '/changes']}
            text='Changes' />
          <HeaderLink
            linkTo='/samples'
            location={location}
            matchRoutes={'/samples'}
            text='Samples' />
          <HeaderLink
            linkTo='/facilities'
            location={location}
            matchRoutes={'/facilities'}
            text='Facilities' />
          <HeaderLink
            linkTo='/riders'
            location={location}
            matchRoutes={'/riders'}
            text='Riders' />
        </ul>
      </div>
    </div>
    );
  }
});
