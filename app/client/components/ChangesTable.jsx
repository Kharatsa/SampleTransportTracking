'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Seq, Map as ImmutableMap} from 'immutable';
import {Table, Column, Cell} from 'fixed-data-table';
import {TextCell, LinkCell, DateCell, MetadataCell} from './CellTypes.jsx';
import WindowSizeListener from '../containers/wrap/WindowSizeListener.jsx';

const FlexTable = WindowSizeListener(Table);

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
        <FlexTable
          rowHeight={ROW_HEIGHT}
          headerHeight={HEADER_HEIGHT}
          rowsCount={data.length}
          width={1100}
          height={600}
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
            cell={<TextCell data={data} col='stage' />} />
          <Column
            header={<Cell>Status</Cell>}
            width={CELL_WIDTH}
            flexGrow={1}
            cell={<MetadataCell
                  data={data}
                  col='status'
                  meta={metadata}
                  type='status' />} />
          <Column
            header={<Cell>Artifact</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='artifactType'
                    meta={metadata}
                    type='artifact' />} />
          <Column
            header={<Cell>Test</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='testType'
                    meta={metadata}
                    type='labTest' />} />
          <Column
            header={<Cell>Rejection</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='labRejection'
                    meta={metadata}
                    type='rejection' />} />
          <Column
            header={<Cell>Person</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='person'
                    meta={metadata}
                    type='person' />} />
          <Column
            header={<Cell>Facility</Cell>}
            flexGrow={1}
            width={CELL_WIDTH}
            cell={<MetadataCell
                    data={data}
                    col='facility'
                    meta={metadata}
                    type='facility' />} />
          <Column
            header={<Cell>Date</Cell>}
            width={200}
            cell={<DateCell data={data} col='statusDate' />} />
        </FlexTable>
      </div>
    );
  }
});
