import React, {PropTypes} from 'react';
import {List, Map as ImmutableMap} from 'immutable';
import {
  Table, Column, AutoSizer, WindowScroller
} from 'react-virtualized';
import {CheckBoxColumn, LinkColumn, DateColumn} from '../Tables';

const defaultProps = {
  width: 150,
  flexGrow: 1
};

const getUserDetailURL = ({dataKey, rowData}) => {
  return {
    url: `/admin/users/${rowData.get(dataKey)}`,
    text: 'Edit',
  };
};

const userByIdRowGetter = ({userIds, usersById}) => {
  return ({index}) => {
    const userId = userIds.get(index, null);
    return usersById.get(`${userId}`, null);
  };
};

export const UsersTable = ({userIds, usersById}) => {
  const numRows = userIds ? userIds.size : 0;
  return (
    <div>
      <WindowScroller>
        {({height, scrollTop}) => (
          <AutoSizer disableHeight>
            {({width}) => (
              <Table
                autoHeight
                headerClassName='headerColumn'
                headerHeight={40}
                height={height}
                rowCount={numRows}
                rowHeight={30}
                rowGetter={userByIdRowGetter({userIds, usersById})}
                scrollTop={scrollTop}
                width={width}
              >
                <Column
                  {...defaultProps} label='Username' dataKey='username'/>
                <Column
                  {...defaultProps} label='Name' dataKey='name'/>
                {DateColumn({
                  ...defaultProps,
                  width: 80,
                  label: 'Created',
                  dataKey: 'createdAt',
                })}
                {DateColumn({
                  ...defaultProps,
                  width: 80,
                  label: 'Updated',
                  dataKey: 'updatedAt',
                })}
                {CheckBoxColumn({
                  ...defaultProps,
                  label: 'Admin',
                  dataKey: 'isAdmin',
                  width: 60,
                })}
                {LinkColumn({
                  ...defaultProps,
                  cellDataGetter: getUserDetailURL,
                  label: '',
                  dataKey: 'id'
                })}
              </Table>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>);
};

UsersTable.propTypes = {
  userIds: PropTypes.instanceOf(List),
  usersById: PropTypes.instanceOf(ImmutableMap),
};

export default UsersTable;
