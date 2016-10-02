import React, {PropTypes} from 'react';
import {Column} from 'react-virtualized';
import {shortFormatDate} from '../../util/stringformat.js';
import {cellRendererPropTypes} from '../../util/proptypes';

const DateCell = ({cellData, key, style}) => {
  return (
    <span key={key} style={style}>
      {shortFormatDate(cellData)}
    </span>);
};

DateCell.propTypes = {
  ...cellRendererPropTypes,
  cellData: PropTypes.string.isRequired,
};

export const DateColumn = (props) => {
  return <Column {...props} cellRenderer={DateCell}/>;
};

export default DateColumn;
