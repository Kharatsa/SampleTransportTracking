import React, {PropTypes} from 'react';
import history from 'react-router/lib/browserHistory';
import {
  SummaryCounts, SummaryTabs, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton, ViewSubPage} from '../components/DashboardControls';


export const TATPage = ({appName}) => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />
  ];

  return (
    <SideMenuLayout
      menuHeader={appName}
      menuItems={controls} 
      >
 
	      <div>
	        <h3 className='dashboard-title'>Turn Around Time (TAT) New Page </h3>
	        <TurnArounds />
	      </div>
    </SideMenuLayout>
  );
};

TATPage.propTypes = {
  appName: PropTypes.string,
};

export default TATPage;
