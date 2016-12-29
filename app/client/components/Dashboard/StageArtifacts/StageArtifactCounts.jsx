import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import StageArtifactsPanel from './StageArtifactsPanel';

export const StageArtifactCounts = ({
  artifactStageCounts, metaStages, metaArtifacts
}) => {
  const stages = artifactStageCounts.map((stage, index) => {
    const stageKey = stage.get('stage');
    const artifactCounts = stage.get('artifacts');
    return (
      <StageArtifactsPanel
        className='pure-u-1 pure-u-lg-1-2'
        key={index}
        artifactCounts={artifactCounts}
        stageKey={stageKey}
        metaArtifacts={metaArtifacts}
        metaStages={metaStages} />
    );
  });

  return (
    <div className='pure-g'>
      {stages}
    </div>
  );
};

StageArtifactCounts.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  artifactStageCounts: PropTypes.instanceOf(List).isRequired
};

export default StageArtifactCounts;
