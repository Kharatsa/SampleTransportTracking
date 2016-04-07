import React from 'react';
import classNames from 'classnames';
import Link from 'react-router/lib/Link';

const SideMenuHeader = ({header}) =>
  <Link to='/' className='pure-menu-heading menu-title green-bg'>
    {header}
  </Link>;

const SideMenuHamburger = ({isMenuOpen, openMenu}) => {
  const clsn = classNames({'active': isMenuOpen, 'menu-link': true});
  return <a id='menuLink' onClick={openMenu} className={clsn}><span></span></a>;
};

const SideMenuRow = ({children}) =>
  <li className='pure-menu-item'>{children}</li>;

const SideMenuOpen = ({isMenuOpen, header, children}) => {
  const clsn = classNames({
    'active': isMenuOpen,
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

export const SideMenu = ({isMenuOpen, openMenu, header, children}) => {
  return <div>
    <SideMenuHamburger isMenuOpen={isMenuOpen} openMenu={openMenu} />
    <SideMenuOpen isMenuOpen={isMenuOpen} header={header}>
      {children}
    </SideMenuOpen>
  </div>;
};

export default SideMenu;
