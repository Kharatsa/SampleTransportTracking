import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    changeIds: PropTypes.instanceOf(Seq),
    changesById: PropTypes.instanceOf(ImmutableMap)
  },

  render() {
    const {height, width} = this.props;
    const {changeIds, changesById} = this.props;
    const {samplesById, artifactsById, labTestsById, metadata} = this.props;

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
            {...this.props}>
          {stIdsCol({data})}
          {labIdsCol({data})}
          {stagesCol({data, metadata: metadata.get('stages')})}
          {statusesCol({data, metadata: metadata.get('statuses')})}
          {artifactsCol({data, metadata: metadata.get('artifacts')})}
          {labTestsCol({data, metadata: metadata.get('labTests')})}
          {facilitiesCol({data, metadata: metadata.get('facilities')})}
          {peopleCol({data, metadata: metadata.get('people')})}
          {statusDatesCol({data, width: 200})}
        </Table>
      </div>
    );
  }
});
