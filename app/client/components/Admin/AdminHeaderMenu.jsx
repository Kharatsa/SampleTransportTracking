import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import withRouter from 'react-router/lib/withRouter';
import {routerPropTypes} from '../../util/proptypes.js';

// TODO(sean): get active link header working (pure-menu-selected)

const AdminLink = ({route, linkPath, linkText}) => {
  return (
    <li className='pure-menu-item'>
      <Link to={linkPath} className='pure-menu-link'>{linkText}</Link>
    </li>
  );
};

export const AdminHeaderMenu = withRouter(({location, router, route, routeParams}) => {
  return (
  <header>
    <nav id='admin-header'>
      <div className='pure-menu pure-menu-horizontal'>
        <Link to='/admin' className='pure-menu-heading pure-menu-link'>STT Admin</Link>
          <ul className='pure-menu-list'>
            <AdminLink route={route} linkPath='/admin/users' linkText='Users' />
            <AdminLink route={route} linkPath='/admin/meta' linkText='Metadata' />
          </ul>
      </div>
    </nav>
  </header>);
});

AdminHeaderMenu.propTypes = {
  ...routerPropTypes,
}

export default AdminHeaderMenu;
