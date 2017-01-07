import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../../DashboardPanel';
import MetaText from '../../MetaText';
import StageArtifactsTable from './StageArtifactsTable';

export const StageArtifactsPanel = ({
  artifactCounts, metaArtifacts, stageKey, metaStages
}) => {
  const stageName = (<MetaText metadata={metaStages} metaKey={stageKey} />);
  return (
    <DashboardPanel
      heading={stageName}
      subheading='TODO' >
      <StageArtifactsTable
        metaArtifacts={metaArtifacts}
        artifactCounts={artifactCounts} />
    </DashboardPanel>
  );
};

StageArtifactsPanel.propTypes = {
  artifactCounts: PropTypes.instanceOf(List).isRequired,
  stageKey: PropTypes.string.isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export default StageArtifactsPanel;
