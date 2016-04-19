import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import MetaText from '../MetaText';

export const StageSampleIdCounts = ({metaStages, sampleIdsStageCounts}) => {
  const stageCounts = sampleIdsStageCounts.map((item, i) =>
    <li key={i}>
      <MetaText
        metadata={metaStages}
        metaKey={item.get('stage')}
      /> {item.get('count')}
    </li>);

  return (
    <DashboardPanel heading='Sample IDs by Stage'>
      <ul>{stageCounts}</ul>
    </DashboardPanel>
  );
};

StageSampleIdCounts.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap),
  sampleIdsStageCounts: PropTypes.instanceOf(List)
};

export default StageSampleIdCounts;
