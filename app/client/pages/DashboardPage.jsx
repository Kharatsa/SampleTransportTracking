import React, {PropTypes} from 'react';
import {
  SummaryCounts, StageDatesCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/DashboardControls';

export const DashboardPage = ({appName, history}) => {
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
        <SummaryCounts />
        <h3 className='dashboard-title'>Sample ID Stages by Date</h3>
        <StageDatesCounts />
        <br style={{'clear': 'left'}} />
        <h3 className='dashboard-title'>Sample & Lab Stage Updates</h3>
        <StageCounts />
        <h3 className='dashboard-title'>Turn Around Time (TAT) Averages</h3>
        <TurnArounds />
      </div>
    </SideMenuLayout>
  );
};

DashboardPage.propTypes = {
  appName: PropTypes.string,
  history: PropTypes.object.isRequired
};

export default DashboardPage;
