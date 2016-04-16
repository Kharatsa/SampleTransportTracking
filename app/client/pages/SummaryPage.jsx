import React, {PropTypes} from 'react';
import {
  SampleCounts, DateFilters, LocationFilters, TotalCounts, TurnArounds
} from '../containers';
import {SideMenuLayout} from '../components';
import {SampleSearch, ViewChangesButton} from '../components/SummaryControls/';

export const SummaryPage = ({appName, history}) => {

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
    <div>
      <SampleCounts />
      <div className='pure-g'>
        {goodCountsView}
        {badCountsView}
        {tatView}
      </div>
    </div>
  );

  const summaryControls = [
    <LocationFilters />,
    <DateFilters />,
    <SampleSearch pushHistory={history.push} />,
    <ViewChangesButton />
  ];

  return (
    <div>
      <SideMenuLayout
          menuHeader={appName}
          menuItems={summaryControls} >
        {combinedMetricsView}
      </SideMenuLayout>
    </div>
  );
};

SummaryPage.propTypes = {
  appName: PropTypes.string,
  history: PropTypes.object.isRequired
};

export default SummaryPage;
