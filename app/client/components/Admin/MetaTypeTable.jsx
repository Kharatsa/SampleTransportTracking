import React, {PropTypes} from 'react';
import {List, Map as ImmutableMap} from 'immutable';
import {Column} from 'react-virtualized';
import {DefaultTable, CheckBoxColumn, DateColumn} from '../Tables';
import {columnDefaults, immutablePairRowGetter} from './admin_utils.js';

export const MetaTypeTable = ({metaByKey, metaKeys, metaTypeName}) => {
  const numRows = metaKeys ? metaKeys.size : 0;

  const columns = [
    <Column {...columnDefaults} key={1} label='ID' dataKey='key'/>,
    <Column {...columnDefaults} key={2} label='Display Name' dataKey='value'/>,
    CheckBoxColumn({
      ...columnDefaults,
      key: 3,
      width: 50,
      label: 'Auto',
      dataKey: 'key',
    }),
    DateColumn({
      ...columnDefaults,
      key: 4,
      width: 80,
      label: 'Created',
      dataKey: 'createdAt',
    }),
    DateColumn({
      ...columnDefaults,
      key: 5,
      width: 80,
      label: 'Updated',
      dataKey: 'updatedAt',
    }),
  ];

  const table = DefaultTable({
    numRows,
    rowGetter: immutablePairRowGetter({
      keys: metaKeys, valuesByKey: metaByKey
    }),
    children: columns,
  });

  return (
    <div>
      <h3>{metaTypeName.toUpperCase()}</h3>
      {table}
    </div>
  );
};

MetaTypeTable.propTypes = {
  metaByKey: PropTypes.instanceOf(ImmutableMap),
  metaKeys: PropTypes.instanceOf(List),
  metaTypeName: PropTypes.string,
};

export default MetaTypeTable;
