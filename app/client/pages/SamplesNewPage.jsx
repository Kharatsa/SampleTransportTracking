import React, {PropTypes} from 'react';
import history from 'react-router/lib/browserHistory';
import {
  SummaryCounts, SummaryTabs, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton, ViewSubPage} from '../components/DashboardControls';


export const SamplesNewPage = ({appName}) => {
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
	        <h3 className='dashboard-title'>Sample ID Stages by Date</h3>
        <StageDatesCounts />
	      </div>
    </SideMenuLayout>
  );
};

SamplesNewPage.propTypes = {
  appName: PropTypes.string,
};

export default SamplesNewPage;