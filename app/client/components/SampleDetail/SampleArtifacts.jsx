import React, {PropTypes} from 'react';
import {Map as ImmutableMap} from 'immutable';
import ChangeRefItem from './ChangeRefItem.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleArtifacts = ({
  artifactsById, changesByArtifactId,
  metaArtifacts, metaStatuses, metaStages
}) => {
  const artifactElems = changesByArtifactId.entrySeq().map(entry => {
    const id = entry[0];
    const changes = entry[1];
    const artifact = artifactsById.get(id);
    return (
      <li key={id}>
        <ChangeRefItem
            changes={changes}
            refItem={artifact}
            refType='artifactType'
            refMeta={metaArtifacts}
            statuses={metaStatuses}
            stages={metaStages} />
      </li>
    );
  });

  return (
    <InfoPanel title='Artifacts'>
      <ul className='table-list'>{artifactElems}</ul>
    </InfoPanel>);
};

SampleArtifacts.propTypes = {
  artifactsById: PropTypes.instanceOf(ImmutableMap).isRequired,
  changesByArtifactId: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired
};

export default SampleArtifacts;
