'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {SideMenuLayout, SummaryFilter, TotalCounts} from '../containers';
import SummaryControls from '../components/SummaryControls';

export const SummaryPage = ({appName}) => {
  const filterView = (
    <div className='panel'>
      <SummaryFilter />
    </div>
  );

  const countsView = (
    <div className="panel pure-u-1 pure-u-md-1 pure-u-lg-1-2">
      <TotalCounts />
    </div>
  );

  const tatView = (
    <div className="panel pure-u-1 pure-u-md-1 pure-u-lg-1-2">
      <span>Turn Around Time</span>
    </div>
  );

  const combinedMetricsView = (
    <div className="pure-g">
      {countsView}
      {tatView}
    </div>
  );

  return (
    <div>
      <SideMenuLayout
          menuHeader={appName}
          menuItems={<SummaryControls />} >
        {filterView}
        {combinedMetricsView}
      </SideMenuLayout>
    </div>
  );
};

export default SummaryPage;
