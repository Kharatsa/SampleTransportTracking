import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import MetaText from '../MetaText';

const statusElements = (metaStatuses, item, index) => {
  const statusKey = item.get('status');
  return (
    <tr key={index}>
      <td><MetaText metadata={metaStatuses} metaKey={statusKey} /></td>
      <td>{item.get('count')}</td>
    </tr>
  );
};

const testElements = (metaStatuses, metaLabTests, item, index) => {
  const counts = item.get('statuses').map((status, i) =>
    statusElements(metaStatuses, status, i));

  const testKey = item.get('test');
  return (
    <table className='widget-table' key={index}>
      <thead>
        <tr>
          <th className='col-1-of-2'>
            <MetaText metadata={metaLabTests} metaKey={testKey} />
          </th>
          <th className='col-2-of-2'>Updates</th>
        </tr>
      </thead>
      <tbody>
        {counts}
      </tbody>
    </table>
  );
};

export const StageLabCounts = ({metaStatuses, metaLabTests, labTestCounts}) => {
  const testCounts = labTestCounts.map((test, i) =>
    testElements(metaStatuses, metaLabTests, test, i));

  return (
    <DashboardPanel
      heading='Lab Tests'
      subheading='Status updates from laboratories'>
      {testCounts}
    </DashboardPanel>
  );
};

StageLabCounts.propTypes = {
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
  labTestCounts: PropTypes.instanceOf(List).isRequired
};

export default StageLabCounts;
