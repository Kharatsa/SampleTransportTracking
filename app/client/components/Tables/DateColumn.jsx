import React, {PropTypes} from 'react';
import {Column} from 'react-virtualized';
import {shortFormatDate, longFormatDateTime} from '../../util/stringformat.js';
import {cellRendererPropTypes} from '../../util/proptypes';

const cellPropTypes = {
  ...cellRendererPropTypes,
  cellData: PropTypes.string.isRequired,
};

const DateCell = ({cellData, key, style}) => {
  return (
    <span key={key} style={style}>
      {shortFormatDate(cellData)}
    </span>);
};

DateCell.propTypes = cellPropTypes;

const DateTimeCell = ({cellData, key, style}) => {
  return (
    <span key={key} style={style}>
      {longFormatDateTime(cellData)}
    </span>);
};

DateTimeCell.propTypes = cellPropTypes;

export const DateColumn = (props) => {
  return <Column {...props} cellRenderer={DateCell}/>;
};

export const DateTimeColumn = (props) => {
  return <Column {...props} cellRenderer={DateTimeCell}/>;
};
