import React from 'react';
import Link from 'react-router/lib/Link';

export const Header = ({appName}) =>
  <div className='horizontal-header'>
    <div className='pure-menu pure-menu-horizontal menu-title black-bg'>
      <Link to='/' className='pure-menu-heading pure-menu-link'>
        {appName}
      </Link>
    </div>
  </div>;

export default Header;
