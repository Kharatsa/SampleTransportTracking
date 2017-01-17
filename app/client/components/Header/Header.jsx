import React from 'react';
import Link from 'react-router/lib/Link';
import {APP_NAME} from '../../../common/sttworkflow';

export const Header = () =>
  <div className='horizontal-header'>
    <div
      id='detail-menu'
      className='pure-menu pure-menu-horizontal menu-title black-bg'
    >
      <Link to='/' className='pure-menu-heading green-bg'>
        {APP_NAME}
      </Link>
    </div>
  </div>;

export default Header;
