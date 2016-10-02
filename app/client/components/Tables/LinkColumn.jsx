import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import {Column} from 'react-virtualized';
import {
  rowRendererPropTypes, routerLocationPropTypes,
} from '../../util/proptypes.js';

export const LinkCell = ({cellData, key, style}) => {
  const cellProps = {key, style};
  if (typeof cellData === 'string' || cellData instanceof String) {
    return <Link to={cellData} {...cellProps}>{cellData}</Link>;
  } else if (cellData && cellData.url && cellData.text) {
    const {url, text} = cellData;
    return <Link to={url} {...cellProps}>{text}</Link>;
  }
};

LinkCell.propTypes = {
  ...rowRendererPropTypes,
  cellData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string,
      text: PropTypes.string,
    }),
  ]),
};

/*
 * LinkColumn factory.
 * cellDataGetter should return a string or an object with shape
 * {url: text, text: string}. The object form will return a Link component
 * as: <Link to={url}>{text}</Link>
 **/
export const LinkColumn = (props) => {
  return <Column {...props} cellRenderer={LinkCell}/>;
};

LinkColumn.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    routerLocationPropTypes,
  ]),
};

export default LinkColumn;
