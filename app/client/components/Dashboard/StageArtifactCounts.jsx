import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import DashboardPanel from '../DashboardPanel';
import Iconic from '../Iconic';
import MetaText from '../MetaText';

const stageArtifactElements = (metaArtifacts, item, index) => {
  const artifactKey = item.get('artifact');
  const goodCount = item.get('goodCount');
  const badCount = item.get('badCount');
  const exceptionIcon = (
    badCount > 0 ?
    <Iconic
      className='widget-table-icon stt-icon'
      color='orange'
      name='warning'/> :
    null
  );

  return (
    <tr key={index}>
      <td>
        <MetaText metadata={metaArtifacts} metaKey={artifactKey} />
      </td>
      <td>{goodCount + badCount}</td>
      <td>{badCount}{exceptionIcon}</td>
    </tr>
  );
};

const stageElements = (metaStages, metaArtifacts, item, index) => {
  const counts = item.get('artifacts').map((artifact, i) =>
    stageArtifactElements(metaArtifacts, artifact, i));

  const stageKey = item.get('stage');
  return (
    <div>
      <table className='widget-table' key={index}>
        <thead>
          <tr>
            <th>
              <MetaText metadata={metaStages} metaKey={stageKey} /> Scan Type
            </th>
            <th>Scans</th>
            <th>Exceptions</th>
          </tr>
        </thead>
        <tbody>
          {counts}
        </tbody>
      </table>
    </div>
  );
};

export const StageArtifactCounts = ({
  metaStages, metaArtifacts, artifactStageCounts
}) => {
  const artifactCounts = artifactStageCounts.map((stage, i) =>
    stageElements(metaStages, metaArtifacts, stage, i));

  return (
    <DashboardPanel
      heading='Samples & Forms'
      subheading=''
    >
      {artifactCounts}
    </DashboardPanel>
  );
};

StageArtifactCounts.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  artifactStageCounts: PropTypes.instanceOf(List).isRequired
};

export default StageArtifactCounts;
