import React, {PropTypes} from 'react';
import {List, Map as ImmutableMap} from 'immutable';
import {Column} from 'react-virtualized';
import {
  DefaultTable, CheckBoxColumn, LinkColumn, DateColumn
} from '../Tables';
import {columnDefaults, immutablePairRowGetter} from './admin_utils.js';

const getUserDetailURL = ({dataKey, rowData}) => {
  return {
    url: `/admin/users/${rowData.get(dataKey)}`,
    text: 'Edit',
  };
};

export const UsersTable = ({userIds, usersById}) => {
  const numRows = userIds ? userIds.size : 0;

  const columns = [
    <Column {...columnDefaults} key={1} label='Username' dataKey='username'/>,
    <Column {...columnDefaults} key={2} label='Name' dataKey='name'/>,
    DateColumn({
      ...columnDefaults,
      key: 3,
      width: 80,
      label: 'Created',
      dataKey: 'createdAt',
    }),
    DateColumn({
      ...columnDefaults,
      key: 4,
      width: 80,
      label: 'Updated',
      dataKey: 'updatedAt',
    }),
    CheckBoxColumn({
      ...columnDefaults,
      key: 5,
      label: 'Admin',
      dataKey: 'isAdmin',
      width: 60,
    }),
    LinkColumn({
      ...columnDefaults,
      key: 6,
      cellDataGetter: getUserDetailURL,
      label: '',
      dataKey: 'id'
    }),
  ];

  return DefaultTable({
    numRows,
    rowGetter: immutablePairRowGetter({
      keys: userIds, valuesByKey: usersById
    }),
    children: columns,
  });
};

UsersTable.propTypes = {
  userIds: PropTypes.instanceOf(List),
  usersById: PropTypes.instanceOf(ImmutableMap),
};

export default UsersTable;
