'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import ChangeRefItem from './ChangeRefItem.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleTests = ({
  labTestsById, changesByLabTestId, metadata
}) => {
  const labTests = metadata.get('labTest');
  const statuses = metadata.get('status');

  const testElems = changesByLabTestId.entrySeq().map(entry => {
    const id = entry[0];
    const changes = entry[1];
    const labTest = labTestsById.get(id);
    return (
      <li key={id}>
        <ChangeRefItem
            changes={changes}
            refItem={labTest}
            refType='testType'
            refMeta={labTests}
            statuses={statuses} />
      </li>
    );
  });

  const body = (<ul className='table-list'>{testElems}</ul>);

  return <InfoPanel title='Lab Tests' body={body} />;
};

export default SampleTests;
