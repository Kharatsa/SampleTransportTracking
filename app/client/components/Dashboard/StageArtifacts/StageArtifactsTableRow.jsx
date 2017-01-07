import React, {PropTypes} from 'react';
import {Map as ImmutableMap} from 'immutable';
import Iconic from '../../Iconic';
import MetaText from '../../MetaText';

export const StageArtifactsRow = ({
  artifactKey, goodCount, badCount, metaArtifacts
}) => {
  const exceptionIcon = (
    badCount > 0 ?
    <Iconic
      className='widget-table-icon stt-icon'
      color='orange'
      name='warning'/> :
    null
  );

  return (
    <tr>
      <td>
        <MetaText metadata={metaArtifacts} metaKey={artifactKey} />
      </td>
      <td>{goodCount + badCount}</td>
      <td>{badCount}{exceptionIcon}</td>
    </tr>
  );
};

StageArtifactsRow.propTypes = {
  artifactKey: PropTypes.string.isRequired,
  goodCount: PropTypes.number.isRequired,
  badCount: PropTypes.number.isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export default StageArtifactsRow;
