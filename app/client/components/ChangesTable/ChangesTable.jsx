import React, {PropTypes} from 'react';
import {Seq, Map as ImmutableMap} from 'immutable';
import {Table} from 'fixed-data-table';
import {
  stIdsCol, labIdsCol, stagesCol, statusesCol, artifactsCol,
  labTestsCol, facilitiesCol, peopleCol, statusDatesCol
} from './ChangesColumns';

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 50;

const changeRow = ({
  changeUUID, changesById, labTestsById, artifactsById, samplesById
}) => {
  const change = changesById.get(changeUUID, null);
  const labTestRef = change.get('labTest', null);
  const artifactRef = change.get('artifact', null);
  const labTest = labTestsById.get(labTestRef, null);
  const artifact = artifactsById.get(artifactRef, null);
  const subject = labTest || artifact;
  const sample = subject ? samplesById.get(subject.get('sampleId')) : null;
  return {
    stId: sample.get('stId'),
    labId: sample.get('labId'),
    stage: change.get('stage'),
    status: change.get('status'),
    labRejection: change.get('labRejection'),
    testType: labTest ? labTest.get('testType') : '',
    artifactType: artifact ? artifact.get('artifactType') : '',
    person: change.get('person'),
    facility: change.get('facility'),
    statusDate: new Date(change.get('statusDate'))
  };
};

export const ChangesTable = (props) => {
  const {
    height, width,
    changeIds, changesById,
    samplesById, artifactsById, labTestsById,
    metaStages, metaStatuses, metaArtifacts,
    metaLabTests, metaFacilities, metaPeople
  } = props;

  const data = changeIds.map(changeUUID =>
    changeRow({
      changeUUID,
      changesById,
      labTestsById,
      artifactsById,
      samplesById
    })
  ).toArray();

  return (
    <div className='panel'>
      <Table
          rowHeight={ROW_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          rowsCount={data.length}
          width={width}
          height={height}
          {...props}>
        {stIdsCol({data})}
        {labIdsCol({data})}
        {stagesCol({data, metadata: metaStages})}
        {statusesCol({data, metadata: metaStatuses})}
        {artifactsCol({data, metadata: metaArtifacts})}
        {labTestsCol({data, metadata: metaLabTests})}
        {facilitiesCol({data, metadata: metaFacilities})}
        {peopleCol({data, metadata: metaPeople})}
        {statusDatesCol({data, width: 200})}
      </Table>
    </div>
  );
};

ChangesTable.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isFetchingData: PropTypes.bool.isRequired,
  changeIds: PropTypes.instanceOf(Seq).isRequired,
  changesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  samplesById: PropTypes.instanceOf(ImmutableMap).isRequired,
  artifactsById: PropTypes.instanceOf(ImmutableMap).isRequired,
  labTestsById: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaFacilities: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaPeople: PropTypes.instanceOf(ImmutableMap).isRequired
};

export default ChangesTable;
