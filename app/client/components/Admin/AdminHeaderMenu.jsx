import React from 'react';
import Link from 'react-router/lib/Link';
import MenuLink from './MenuLink.jsx';
//
// TODO(sean): get active link header working with route (pure-menu-selected)

export const AdminHeaderMenu = () => {
  return (
  <header>
    <nav id='admin-header'>
      <div className='pure-menu pure-menu-horizontal'>
        <Link to='/admin' className='pure-menu-heading pure-menu-link'>
          STT Admin
        </Link>
        <ul className='pure-menu-list'>
          <MenuLink path='/admin/users' label='Users'/>
          <MenuLink path='/admin/meta' label='Metadata'/>
        </ul>
      </div>
    </nav>
  </header>);
};

export default AdminHeaderMenu;
