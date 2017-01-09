import React from 'react';
import history from 'react-router/lib/browserHistory';
import {APP_NAME} from '../../common/sttworkflow';
import {
  DashboardData, DateFilters, LocationFilters,
  SummaryCounts, StageDatesCounts, StageArtifactCounts,
} from '../containers';
import {SideMenuLayout, SummaryTabs} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/DashboardControls';

export const DashboardPage = () => {
  const controls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />,
    <ViewChangesButton />
  ];

  return (
    <SideMenuLayout
      menuHeader={APP_NAME}
      menuItems={controls}
    >
      <div>
        <DashboardData />
        <SummaryTabs />
        <SummaryCounts />
        <h3 className='dashboard-title'>Sample ID Stages by Date</h3>
        <StageDatesCounts />
        <br style={{'clear': 'left'}} />
        <h3 className='dashboard-title'>Sample & Lab Stage Updates</h3>
        <StageArtifactCounts />
      </div>
    </SideMenuLayout>
  );
};

export default DashboardPage;
