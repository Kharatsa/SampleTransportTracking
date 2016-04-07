import React from 'react';
import WaitOnFetch from '../containers/wrappers/WaitOnFetch';
import {
  SummaryFilter, TotalCounts, SummaryLocationFilters
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/SummaryControls/';

const WrappedFilterControls = WaitOnFetch(SummaryFilter);

export const SummaryPage = (props) => {
  const {appName, history} = props;

  const filterView = (
    <div className='panel'>
      <WrappedFilterControls />
    </div>
  );

  const countsView = (
    <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-2'>
      <TotalCounts />
    </div>
  );

  const tatView = (
    <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-2'>
      <span>Turn Around Time</span>
    </div>
  );

  const combinedMetricsView = (
    <div className='pure-g'>
      {countsView}
      {tatView}
    </div>
  );

  const summaryControls = [
    <SampleSearch pushHistory={history.push} />,
    <ViewChangesButton />,
    <SummaryLocationFilters />
  ];

  return (
    <div>
      <SideMenuLayout
          menuHeader={appName}
          menuItems={summaryControls} >
        {filterView}
        {combinedMetricsView}
      </SideMenuLayout>
    </div>
  );
};

export default SummaryPage;
