import React from 'react';
import Link from 'react-router/lib/Link';
import SideMenuButton from '../SideMenu/SideMenuButton';

export const ChangesButton = () => {
  return (
    <Link to='/changes'>
      <SideMenuButton>View Details</SideMenuButton>
    </Link>
  );
};

export default ChangesButton;
