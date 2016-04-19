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
      subheading='Package Scans'
    >
      <table className='widget-table'>
        <thead>
          <tr>
            <th>Scan Stage</th>
            <th>Total</th>
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
