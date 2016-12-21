import React, {PropTypes} from 'react';
import history from 'react-router/lib/browserHistory';
import {
  SummaryCounts, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters, SummaryTabs, StageCounts2
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/DashboardControls';

export const DashboardPage = ({appName}) => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />,
    <ViewChangesButton />
  ];

  return (
    <SideMenuLayout
      menuHeader={appName}
      menuItems={controls}
    >
      <div>
        <SummaryTabs/>
        <SummaryCounts />
        <h3 className='dashboard-title'>Sample ID Stages by Date</h3>
        <StageDatesCounts />
        <br style={{'clear': 'left'}} />
        <h3 className='dashboard-title'>Sample & Lab Stage Updates</h3>
        <StageCounts2 />
      </div>
    </SideMenuLayout>
  );
};

DashboardPage.propTypes = {
  appName: PropTypes.string,
};

export default DashboardPage;