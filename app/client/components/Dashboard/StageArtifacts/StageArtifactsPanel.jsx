import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../../DashboardPanel';
import MetaText from '../../MetaText';
import StageArtifactsTable from './StageArtifactsTable';

export const StageArtifactsPanel = ({
  artifactCounts, metaArtifacts, stageKey, metaStages,
}) => {
  const stageName = (<MetaText metadata={metaStages} metaKey={stageKey} />);
  return (
    <div className='pure-u-1 pure-u-md-1-2'>
      <DashboardPanel
        heading={stageName}
      >
        <StageArtifactsTable
          metaArtifacts={metaArtifacts}
          artifactCounts={artifactCounts} />
      </DashboardPanel>
    </div>
  );
};

StageArtifactsPanel.propTypes = {
  artifactCounts: PropTypes.instanceOf(List).isRequired,
  stageKey: PropTypes.string.isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export default StageArtifactsPanel;
