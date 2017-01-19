import React from 'react';
import {APP_NAME} from '../../common/sttworkflow';
import {
  LocationFilters, DateFilters, TurnArounds, TurnAroundsData,
} from '../containers';
import {SideMenuLayout} from '../components';
import {ReturnToDashboard} from '../components/DashboardControls';

export const TATPage = () => {
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
      <TurnAroundsData />
      <div>
        <h2 className='dashboard-title'>Turn Around Times</h2>
        <TurnArounds/>
      </div>
    </SideMenuLayout>
  );
};

export default TATPage;
