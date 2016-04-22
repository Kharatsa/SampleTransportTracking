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
        <StageDatesCounts />
        <br style={{'clear': 'left'}} />
        <StageCounts />
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
