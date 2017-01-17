import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import StageArtifactsTableRow from './StageArtifactsTableRow';

export const StageArtifactsTable = ({
  artifactCounts, metaArtifacts
}) => {
  const rows = artifactCounts.map((artifact, index) => {
    return (
      <StageArtifactsTableRow
        key={index}
        artifactKey={artifact.get('artifact')}
        goodCount={artifact.get('goodCount')}
        badCount={artifact.get('badCount')}
        metaArtifacts={metaArtifacts} />
    );
  });

  return (
    <table className='widget-table'>
      <thead>
        <tr>
          <th className='col-1-of-3'>Scan Type</th>
          <th className='col-2-of-3'>Scans</th>
          <th className='col-3-of-3'>Exceptions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

StageArtifactsTable.propTypes = {
  artifactCounts: PropTypes.instanceOf(List).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export default StageArtifactsTable;
