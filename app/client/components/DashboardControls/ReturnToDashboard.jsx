import React from 'react';
import Link from 'react-router/lib/Link';
import SideMenuButton from '../SideMenu/SideMenuButton';

export const dashboardButton = () => {
  return (
    <Link to='/dashboard'>
      <SideMenuButton>Back to Dashboard</SideMenuButton>
    </Link>	
  );
};

export default dashboardButton;