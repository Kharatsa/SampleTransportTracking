'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {OrderedSet, Map as ImmutableMap} from 'immutable';
import {Column, Cell} from 'fixed-data-table';
import {TextCell, DateCell, MetadataCell} from './CellTypes.jsx';
import FlexTable from '../containers/FlexTable.jsx';

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 50;

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    changes: PropTypes.instanceOf(OrderedSet),
    changesById: PropTypes.instanceOf(ImmutableMap)
  },

  render() {
    const {changes, changesById} = this.props;
    const {samplesById, artifactsById, labTestsById, metadata} = this.props;

    const data = changes.map(changeRef => {
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
            cell={<TextCell data={data} col='stId' />}
            fixed={true}
            width={120} />
          <Column
            header={<Cell>Lab ID</Cell>}
            cell={<TextCell data={data} col='labId' />}
            fixed={true}
            width={120} />
          <Column
            header={<Cell>Stage</Cell>}
            cell={<TextCell data={data} col='stage' />}
            width={150} />
          <Column
            header={<Cell>Status</Cell>}
            cell={<MetadataCell data={data} col='status' meta={metadata} type='status' />}
            // cell={<TextCell data={data} col='status' />}
            width={150} />
          <Column
            header={<Cell>Artifact</Cell>}
            cell={<MetadataCell data={data} col='artifactType' meta={metadata} type='artifact' />}
            // cell={<TextCell data={data} col='artifactType' />}
            width={150} />
          <Column
            header={<Cell>Test</Cell>}
            cell={<MetadataCell data={data} col='testType' meta={metadata} type='labTest' />}
            // cell={<TextCell data={data} col='testType' />}
            width={150} />
          <Column
            header={<Cell>Rejection</Cell>}
            cell={<MetadataCell data={data} col='labRejection' meta={metadata} type='rejection' />}
            // cell={<TextCell data={data} col='labRejection' />}
            width={150} />
          <Column
            header={<Cell>Person</Cell>}
            // cell={<TextCell data={data} col='person' />}
            cell={<MetadataCell data={data} col='person' meta={metadata} type='person' />}
            width={150} />
          <Column
            header={<Cell>Facility</Cell>}
            cell={<MetadataCell data={data} col='facility' meta={metadata} type='facility' />}
            // cell={<TextCell data={data} col='facility' />}
            width={150} />
          <Column
            header={<Cell>Date</Cell>}
            cell={<DateCell data={data} col='statusDate' />}
            width={210} />
        </FlexTable>
      </div>
    );
  }
});
