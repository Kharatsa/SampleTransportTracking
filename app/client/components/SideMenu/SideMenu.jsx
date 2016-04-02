'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import classNames from 'classnames';
import Link from 'react-router/lib/Link';

const SideMenuHeader = ({header}) =>
  <Link to='/' className='pure-menu-heading green-bg'>{header}</Link>;


const SideMenuHamburger = ({isOpen, openMenu}) => {
  const clsn = classNames({'active': isOpen, 'menu-link': true});
  return <a id='menuLink' onClick={openMenu} className={clsn}><span></span></a>;
};

const SideMenuRow = ({children}) =>
  <li className='pure-menu-item'>{children}</li>;

const SideMenuOpen = ({isOpen, header, children}) => {
  const clsn = classNames({
    'active': isOpen,
    'pure-menu': true,
    'black-bg': true
  });

  children = Array.isArray(children) ? children : [children];

  const menuItems = children.map((child, i) =>
    <SideMenuRow key={i}>{child}</SideMenuRow>);

  return (
    <div id='menu' className={clsn}>
      <SideMenuHeader header={header} />
      <ul className='pure-menu-list'>
        {menuItems}
      </ul>
    </div>
  );
};

export const SideMenu = ({isOpen, openMenu, header, children}) => {
  return <div>
    <SideMenuHamburger isOpen={isOpen} openMenu={openMenu} />
    <SideMenuOpen isOpen={isOpen} header={header}>
      {children}
    </SideMenuOpen>
  </div>;
};

export default SideMenu;
