import React, {PropTypes} from 'react';
import {Map as ImmutableMap} from 'immutable';
import ChangeRefItem from './ChangeRefItem.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleTests = ({
  labTestsById, changesByLabTestId,
  metaLabTests, metaStatuses, metaStages
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
            refMeta={metaLabTests}
            statuses={metaStatuses}
            stages={metaStages}
        />
      </li>
    );
  });

  return (
    <InfoPanel title='Lab Tests'>
      <ul className='table-list'>{testElems}</ul>
    </InfoPanel>
    );
};

SampleTests.propTypes = {
  labTestsById: PropTypes.instanceOf(ImmutableMap).isRequired,
  changesByLabTestId: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired
};

export default SampleTests;
