import React from 'react';
import ChangeRefItem from './ChangeRefItem.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleTests = ({
  labTestsById, changesByLabTestId, metadata
}) => {
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
            refMeta={metadata.get('labTests')}
            statuses={metadata.get('statuses')}
            stages={metadata.get('stages')} />
      </li>
    );
  });

  const body = (<ul className='table-list'>{testElems}</ul>);

  return <InfoPanel title='Lab Tests' body={body} />;
};

export default SampleTests;
