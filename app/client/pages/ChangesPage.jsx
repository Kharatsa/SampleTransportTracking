import React from 'react';
import {APP_NAME} from '../../common/sttworkflow';
import {Changes, ChangesExportLink, Pagination} from '../containers';
import SideMenuLayout from '../components/SideMenu/SideMenuLayout';
import SideMenuButton from '../components/SideMenu/SideMenuButton';

export const ChangesPage = () => {
  const exportButton = (
    <ChangesExportLink>
      <SideMenuButton>CSV Export</SideMenuButton>
    </ChangesExportLink>
  );

  return (
    <SideMenuLayout
        menuHeader={APP_NAME}
        menuItems={[exportButton]}
    >
      <Changes />
      <Pagination />
    </SideMenuLayout>);
};

export default ChangesPage;
