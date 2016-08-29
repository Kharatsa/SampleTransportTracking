import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import {fromJS, Map as ImmutableMap, List} from 'immutable';
import {
  FlexTable, FlexColumn, AutoSizer, WindowScroller
} from 'react-virtualized';

const defaultProps = {
  width: 150,
  flexGrow: 1
};

const getUserDetailURL = ({columnData, dataKey, rowData}) => {
  return `users/${rowData.get(dataKey)}`;
};

const editLinkColumn = <FlexColumn
  {...defaultProps} cellDataGetter={getUserDetailLink}
  label='' dataKey='username'/>;

const userByIdRowGetter = ({userIds, usersById}) => {
  return ({index}) => {
    const userId = userIds.get(index, null);
    return usersById.get(`${userId}`, null);
  };
};

const getUserDetailLink = ({cellData}) => {
  return <Link to={cellData}>Edit</Link>;
};

export const UsersTable = ({userIds, usersById}) => {
  const numRows = userIds ? userIds.size : 0;
  return (
    <WindowScroller>
      {({height, isScrolling, scrollTop}) => (
        <AutoSizer disableHeight>
          {({width}) => (
            <FlexTable
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
              <FlexColumn
                {...defaultProps} label='Username' dataKey='username'/>
              <FlexColumn
                {...defaultProps} label='Name' dataKey='name'/>
             <FlexColumn
               {...defaultProps} width={150} label='Created'
               dataKey='createdAt'/>
              <FlexColumn
                {...defaultProps}
                label='Is Admin'
                dataKey='isAdmin'/>
              <FlexColumn
                {...defaultProps} cellDataGetter={getUserDetailURL}
                cellRenderer={getUserDetailLink}
                label='' dataKey='id'/>
            </FlexTable>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default UsersTable;
