'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {
  SideMenuLayout, Changes, ChangesExportLink, Pagination
} from '../containers';
import SideMenuButton from '../components/SideMenu/SideMenuButton';

export const ChangesPage = (props) => {
  const {appName} = props;
  const changes = React.createElement(Changes, props);

  const exportButton = (
    <ChangesExportLink>
      <SideMenuButton>CSV Export</SideMenuButton>
    </ChangesExportLink>
  );

  return (
    <SideMenuLayout
        menuHeader={appName}
        menuItems={exportButton} >
      {changes}
      <Pagination />
    </SideMenuLayout>);
};

export default ChangesPage;
