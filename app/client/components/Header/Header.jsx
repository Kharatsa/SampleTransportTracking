import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';

export const Header = ({appName}) =>
  <div className='horizontal-header'>
    <div id='detail-menu' className='pure-menu pure-menu-horizontal menu-title black-bg'>
      <Link to='/' className='pure-menu-heading green-bg'>
        {appName}
      </Link>
    </div>
  </div>;

Header.propTypes = {
  appName: PropTypes.string
};

export default Header;
