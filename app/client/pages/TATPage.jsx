import React, {PropTypes} from 'react';
import history from 'react-router/lib/browserHistory';
import {
  SummaryCounts, SummaryTabs, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton, ReturnToDashboard} from '../components/DashboardControls';


export const TATPage = ({appName}) => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <ReturnToDashboard/>

  ];

  return (
    <SideMenuLayout
      menuHeader={appName}
      menuItems={controls} 
      >
	      <div>
	        <h2 className='dashboard-title'>Turn Around Times</h2>
	        <TurnArounds/>
	      </div>
    </SideMenuLayout>
  );
};

TATPage.propTypes = {
  appName: PropTypes.string,
};

export default TATPage;
