'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import ChangeRefItem from './ChangeRefItem.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleArtifacts = ({
  artifactsById, changesByArtifactId, metadata
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
            refMeta={metadata.get('artifacts')}
            statuses={metadata.get('statuses')}
            stages={metadata.get('stages')} />
      </li>
    );
  });

  const body = (<ul className='table-list'>{artifactElems}</ul>);

  return <InfoPanel title='Artifacts' body={body} />;
};

export default SampleArtifacts;
