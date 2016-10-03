import React, {PropTypes} from 'react';
import {Table, AutoSizer, WindowScroller} from 'react-virtualized';
import {childrenPropType} from '../../util/proptypes.js';

export const DEFAULT_ROW_HEIGHT = 40;

export const DefaultTable = ({
  numRows, headerHeight=DEFAULT_ROW_HEIGHT, rowHeight=DEFAULT_ROW_HEIGHT,
  children, ...rest,
}) => {
  return (
    <WindowScroller>
      {({height, scrollTop}) => (
        <AutoSizer disableHeight>
          {({width}) => (
            <Table
              autoHeight
              headerClassName='headerColumn'
              headerHeight={headerHeight}
              height={height}
              rowCount={numRows}
              rowHeight={rowHeight}
              scrollTop={scrollTop}
              width={width}
              {...rest}>{children}</Table>
          )}
        </AutoSizer>
      )}
    </WindowScroller>);
};

DefaultTable.propTypes = {
  numRows: PropTypes.number,
  headerHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  children: childrenPropType,
};

export default DefaultTable;
