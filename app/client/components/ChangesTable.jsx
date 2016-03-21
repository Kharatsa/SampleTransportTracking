'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Seq, Map as ImmutableMap} from 'immutable';
import {Table, Column, Cell} from 'fixed-data-table';
import {LinkCell, DateCell, MetadataCell} from './CellTypes.jsx';

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 50;
const CELL_WIDTH = 150;

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

    const data = changeIds.map(changeRef => {
      const change = changesById.get(changeRef);
      const labTestRef = change.get('labTest');
      const artifactRef = change.get('artifact');
      const labTest = labTestRef ? labTestsById.get(labTestRef) : null;
      const artifact = artifactRef ? artifactsById.get(artifactRef) : null;
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
    }).toArray();

    return (
      <div className='panel'>
        <Table
          rowHeight={ROW_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          rowsCount={data.length}
          width={width}
          height={height}
          {...this.props}>
          <Column
            header={<Cell>ST ID</Cell>}
            fixed={true}
            width={CELL_WIDTH}
            cell={<LinkCell data={data} col='stId' route='/samples' />} />
          <Column
            header={<Cell>Lab ID</Cell>}
            fixed={true}
            width={CELL_WIDTH}
            cell={<LinkCell data={data} col='labId' route='/samples' />} />
          <Column
            header={<Cell>Stage</Cell>}
            width={CELL_WIDTH}
            flexGrow={1}
            cell={<MetadataCell
                  data={data}
                  col='stage'
                  metadata={metadata.get('stages')} />} />
          <Column
            header={<Cell>Status</Cell>}
            width={CELL_WIDTH}
            flexGrow={1}
            cell={<MetadataCell
                  data={data}
                  col='status'
                  metadata={metadata.get('statuses')} />} />
          <Column
            header={<Cell>Artifact</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='artifactType'
                    metadata={metadata.get('artifacts')} />} />
          <Column
            header={<Cell>Test</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='testType'
                    metadata={metadata.get('labTests')} />} />
          <Column
            header={<Cell>Rejection</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='labRejection'
                    metadata={metadata.get('rejections')} />} />
          <Column
            header={<Cell>Facility</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='facility'
                    metadata={metadata.get('facilities')} />} />
          <Column
            header={<Cell>Person</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='person'
                    metadata={metadata.get('people')} />} />
          <Column
            header={<Cell>Date</Cell>}
            width={200}
            cell={<DateCell data={data} col='statusDate' />} />
        </Table>
      </div>
    );
  }
});
