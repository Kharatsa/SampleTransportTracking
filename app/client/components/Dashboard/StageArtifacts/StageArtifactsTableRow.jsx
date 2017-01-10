import React, {PropTypes} from 'react';
import {Map as ImmutableMap} from 'immutable';
import Iconic from '../../Iconic';
import MetaText from '../../MetaText';

const exceptionIcon = exceptions => {
  if (exceptions) {
    return (
      <Iconic
        className='widget-table-icon stt-icon warning-icon'
        name='warning'
      />
    );
  }
  return null;
};

export const StageArtifactsRow = ({
  artifactKey, goodCount, badCount, metaArtifacts
}) => {
  return (
    <tr>
      <td>
        <MetaText metadata={metaArtifacts} metaKey={artifactKey} />
      </td>
      <td>{goodCount + badCount}</td>
      <td>{badCount}{exceptionIcon(badCount)}</td>
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
