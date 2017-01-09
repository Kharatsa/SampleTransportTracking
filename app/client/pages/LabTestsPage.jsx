import React from 'react';
import {APP_NAME} from '../../common/sttworkflow';
import {DateFilters, LabTestCounts, LocationFilters} from '../containers';
import {SideMenuLayout} from '../components';
import {ReturnToDashboard} from '../components/DashboardControls';

export const LabTestsPage = () => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <ReturnToDashboard/>
  ];

  return (
    <SideMenuLayout
      menuHeader={APP_NAME}
      menuItems={controls}
    >
      <div>
        <h2 className='dashboard-title'>Lab Tests</h2>
        <LabTestCounts/>
      </div>
    </SideMenuLayout>
  );
};

export default LabTestsPage;
