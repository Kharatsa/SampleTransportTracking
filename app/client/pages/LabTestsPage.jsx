import React, {PropTypes} from 'react';
import history from 'react-router/lib/browserHistory';
import {
  SummaryCounts, SummaryTabs, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters, StageCounts2, LabTestCounts,
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton, ReturnToDashboard} from '../components/DashboardControls';


export const LabTestsPage = ({appName}) => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />,
    <ReturnToDashboard/>
  ];

  return (
    <SideMenuLayout
      menuHeader={appName}
      menuItems={controls} 
      >
 
	      <div>
	        <h2 className='dashboard-title'>Lab Tests</h2>
        <StageCounts2/>
	      </div>
    </SideMenuLayout>
  );
};

LabTestsPage .propTypes = {
  appName: PropTypes.string,
};

export default LabTestsPage;