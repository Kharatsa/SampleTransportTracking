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
        key={index}
        artifactCounts={artifactCounts}
        stageKey={stageKey}
        metaArtifacts={metaArtifacts}
        metaStages={metaStages} />
    );
  });

  return (
    <div>
      <div className='pure-g'>
        {stages.slice(0, 2)}
      </div>
      <div className='pure-g'>
        {stages.slice(2, stages.length)}
      </div>
    </div>
  );
};

StageArtifactCounts.propTypes = {
  artifactStageCounts: PropTypes.instanceOf(List).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export default StageArtifactCounts;
