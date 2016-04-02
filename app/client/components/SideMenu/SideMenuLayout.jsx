'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SideMenu from './SideMenu';

export const SideMenuLayout = (props) => {
  const {menuOpen, menuHeader, menuItems, children} = props;
  const {toggleMenu} = props.actions;

  return (
    <div id='layout' className={menuOpen ? 'active' : ''}>
      <SideMenu header={menuHeader} isOpen={menuOpen} openMenu={toggleMenu}>
        {menuItems}
      </SideMenu>
      <div id='main'>
        {children}
      </div>
    </div>
  );
};

export default SideMenuLayout;
