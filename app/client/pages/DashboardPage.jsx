import React, {PropTypes} from 'react';
import {
  SummaryCounts, StageCounts, TurnArounds,
  DateFilters, LocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/SummaryControls/';

export const DashboardPage = ({appName, history}) => {
  const summaryControls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />,
    <ViewChangesButton />
  ];

  return (
    <SideMenuLayout menuHeader={appName} menuItems={summaryControls}>
      <div>
        <SummaryCounts />
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
