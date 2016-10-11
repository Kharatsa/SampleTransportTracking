import React, {PropTypes} from 'react';
import {List, Map as ImmutableMap} from 'immutable';
import {
  DefaultTable, LinkColumn, DateTimeColumn, MetadataColumn,
} from '../Tables';

const getSampleDetailURL = ({dataKey, rowData}) => {
  const sampleId = rowData[dataKey] || '';
  return {
    url: `/samples/${sampleId}`,
    text: `${sampleId}`,
  };
};

const COLUMN_DEFAULTS = {
  width: 100,
  flexGrow: 1,
};

const makeChangeGetter = changes =>
  ({index}) =>
    changes.get(index);

export const ChangesTable = ({
  changes, metaStages, metaStatuses, metaArtifacts, metaLabTests,
  metaFacilities, metaPeople,
}) => {

  const columns = [
    LinkColumn({
      ...COLUMN_DEFAULTS,
      key: 1,
      cellDataGetter: getSampleDetailURL,
      label: 'ST ID',
      dataKey: 'stId',
    }),
    LinkColumn({
      ...COLUMN_DEFAULTS,
      key: 2,
      cellDataGetter: getSampleDetailURL,
      label: 'Lab ID',
      dataKey: 'labId',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 3,
      label: 'Stage',
      columnData: metaStages,
      dataKey: 'stage',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 4,
      label: 'Status',
      columnData: metaStatuses,
      dataKey: 'status',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 5,
      label: 'Sample',
      columnData: metaArtifacts,
      dataKey: 'artifactType',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 6,
      label: 'Test',
      columnData: metaLabTests,
      dataKey: 'testType',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 7,
      label: 'Facility',
      columnData: metaFacilities,
      dataKey: 'facility',
    }),
    MetadataColumn({
      ...COLUMN_DEFAULTS,
      key: 8,
      label: 'Rider',
      columnData: metaPeople,
      dataKey: 'person',
    }),
    DateTimeColumn({
      ...COLUMN_DEFAULTS,
      key: 9,
      label: 'Status Date',
      dataKey: 'statusDate',
    }),
  ];

  const numRows = changes ? changes.size : 0;

  return (
    <div className='panel'>
      {DefaultTable({
        numRows,
        rowGetter: makeChangeGetter(changes),
        children: columns,
      })}
    </div>
  );
};

ChangesTable.propTypes = {
  changes: PropTypes.instanceOf(List).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaFacilities: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaPeople: PropTypes.instanceOf(ImmutableMap).isRequired
};

export default ChangesTable;
