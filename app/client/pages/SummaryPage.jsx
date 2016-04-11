import React from 'react';
import WaitOnFetch from '../containers/wrappers/WaitOnFetch';
import {
  SummaryFilter, TotalCounts, SummaryLocationFilters, TurnArounds
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

  const goodCountsView = (
    <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-3'>
      <TotalCounts goodCounts={true}/>
    </div>
  );

  const badCountsView = (
    <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-3'>
      <TotalCounts goodCounts={false}/>
    </div>
  );

  const tatView = (
    <div className='panel pure-u-1 pure-u-md-1 pure-u-lg-1-3'>
      <TurnArounds />
    </div>
  );

  const combinedMetricsView = (
    <div className='pure-g'>
      {goodCountsView}
      {badCountsView}
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
