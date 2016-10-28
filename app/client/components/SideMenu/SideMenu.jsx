import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Link from 'react-router/lib/Link';

const sharedPropTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  header: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

const SideMenuHeader = ({header}) =>
  <Link to='/' className='pure-menu-heading menu-title green-bg'>
    {header}
  </Link>;

SideMenuHeader.propTypes = {
  header: sharedPropTypes.header,
};

const SideMenuHamburger = ({isMenuOpen, openMenu}) => {
  const clsn = classNames({'active': isMenuOpen, 'menu-link': true});
  return <a id='menuLink' onClick={openMenu} className={clsn}><span></span></a>;
};

SideMenuHamburger.propTypes = {
  isMenuOpen: sharedPropTypes.isMenuOpen,
  openMenu: sharedPropTypes.openMenu,
};

const SideMenuRow = ({children}) =>
  <li className='pure-menu-item'>{children}</li>;

SideMenuRow.propTypes = {
  children: sharedPropTypes.children,
};

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

SideMenuOpen.propTypes = {
  isMenuOpen: sharedPropTypes.isMenuOpen,
  header: sharedPropTypes.header,
  children: sharedPropTypes.children,
};

export const SideMenu = ({isMenuOpen, openMenu, header, children}) => {
  return <div>
    <SideMenuHamburger isMenuOpen={isMenuOpen} openMenu={openMenu} />
    <SideMenuOpen isMenuOpen={isMenuOpen} header={header}>
      {children}
    </SideMenuOpen>
  </div>;
};

SideMenu.propTypes = sharedPropTypes;

export default SideMenu;
