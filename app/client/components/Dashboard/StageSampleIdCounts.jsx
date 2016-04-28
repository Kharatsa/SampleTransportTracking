import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import MetaText from '../MetaText';

export const StageSampleIdCounts = ({metaStages, sampleIdsStageCounts}) => {
  const stageCounts = sampleIdsStageCounts.map((item, i) =>
    <tr key={i}>
      <td>
        <MetaText
          metadata={metaStages}
          metaKey={item.get('stage')}
        />
      </td>
      <td>{item.get('count')}</td>
    </tr>);

  return (
    <DashboardPanel
      heading='Sample IDs'
      subheading='request package scans'
    >
      <table className='widget-table'>
        <thead>
          <tr>
            <th className='col-1-of-2'>Stage</th>
            <th className='col-2-of-2'>Scans</th>
          </tr>
        </thead>
        <tbody>
          {stageCounts}
        </tbody>
      </table>

    </DashboardPanel>
  );
};

StageSampleIdCounts.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap),
  sampleIdsStageCounts: PropTypes.instanceOf(List)
};

export default StageSampleIdCounts;
