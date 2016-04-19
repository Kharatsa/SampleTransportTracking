import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import MetaText from '../MetaText';

const statusElements = (metaStatuses, item, index) => {
  const statusKey = item.get('status');
  return (
    <li key={index}>
      <MetaText metadata={metaStatuses} metaKey={statusKey} />:
       {item.get('count')}
    </li>);
};

const testElements = (metaStatuses, metaLabTests, item, index) => {
  const counts = item.get('statuses').map((status, i) =>
    statusElements(metaStatuses, status, i));

  const testKey = item.get('test');
  return (
    <li key={index}>
      <MetaText metadata={metaLabTests} metaKey={testKey} />
      <ul>{counts}</ul>
    </li>
  );
};

export const StageLabCounts = ({metaStatuses, metaLabTests, labTestCounts}) => {
  const testCounts = labTestCounts.map((test, i) =>
    testElements(metaStatuses, metaLabTests, test, i));

  return (
    <DashboardPanel heading='Lab Tests Status' subheading='Yadda Yadda'>
      <ul>{testCounts}</ul>
    </DashboardPanel>
  );
};

StageLabCounts.propTypes = {
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
  labTestCounts: PropTypes.instanceOf(List).isRequired
};

export default StageLabCounts;
