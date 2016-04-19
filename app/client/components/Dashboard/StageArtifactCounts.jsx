import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import MetaText from '../MetaText';

const stageArtifactElements = (metaArtifacts, item, index) => {
  const artifactKey = item.get('artifact');
  return (
    <li key={index}>
      <MetaText metadata={metaArtifacts} metaKey={artifactKey} />:
      {`Good=${item.get('goodCount')}, Bad=${item.get('badCount')}`}
    </li>);
};

const stageElements = (metaStages, metaArtifacts, item, index) => {
  const counts = item.get('artifacts').map((artifact, i) =>
    stageArtifactElements(metaArtifacts, artifact, i));

  const stageKey = item.get('stage');
  return (
    <li key={index}>
      <MetaText metadata={metaStages} metaKey={stageKey} /> Scans
      <ul>{counts}</ul>
    </li>
  );
};

export const StageArtifactCounts = ({
  metaStages, metaArtifacts, artifactStageCounts
}) => {
  const artifactCounts = artifactStageCounts.map((stage, i) =>
    stageElements(metaStages, metaArtifacts, stage, i));

  return (
    <DashboardPanel heading='Artifacts by Stage'>
      <ul>{artifactCounts}</ul>
    </DashboardPanel>
  );
};

StageArtifactCounts.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  artifactStageCounts: PropTypes.instanceOf(List).isRequired
};

export default StageArtifactCounts;
