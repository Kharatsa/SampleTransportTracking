import React, {PropTypes} from 'react';
import {Column} from 'react-virtualized';
import {cellRendererPropTypes} from '../../util/proptypes.js';

const CheckBoxCell = ({cellData, style, key}) => {
  const checked = cellData ? 'checked' : '';
  return (
    <label className='pure-checkbox' style={style} key={key}>
      <input type='checkbox' disabled readOnly checked={checked}/> {cellData}
    </label>
  );
};

CheckBoxCell.propTypes = {
  ...cellRendererPropTypes,
  cellData: PropTypes.any,
};

/*
 * CheckBox input Column factory
 **/
export const CheckBoxColumn = (props) => {
  return <Column cellRenderer={CheckBoxCell} {...props}/>;
};

export default CheckBoxColumn;
