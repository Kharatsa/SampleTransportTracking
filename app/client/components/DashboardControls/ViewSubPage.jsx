import React from 'react';
import Link from 'react-router/lib/Link';
import SideMenuButton from '../SideMenu/testButton';

export const tatButton = () => {
  return (
    <Link to='/tatsPage'>
      <testButton>View TAT Details</testButton>
    </Link>
  );
};

export default tatButton;