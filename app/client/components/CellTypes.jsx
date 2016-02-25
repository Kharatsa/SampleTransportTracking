'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Link from 'react-router/lib/Link';
import {Cell} from 'fixed-data-table';
// import {shortFormatDate, longFormatDate} from '../util/stringformat.js';

export const TextCell = ({rowIndex, data, col}) => (
  <Cell>{data[rowIndex][col]}</Cell>
);

export const LinkCell = ({rowIndex, data, col, route}) =>  {
  const value = data[rowIndex][col] || '';
  const linkTo = `${route}/${value}`;
  if (value) {
    return <Cell><Link to={linkTo}>{value}</Link></Cell>;
  }
  return <TextCell rowIndex={rowIndex} data={data} col={col} />;
};

export const DateCell = ({rowIndex, data, col}) => {
  return (<Cell>{data[rowIndex][col].toLocaleString()}</Cell>);
};

export const MetadataCell = ({rowIndex, data, col, meta, type}) => {
  const metaType = meta.get(type);
  const metaKey = data[rowIndex][col];
  const metaRecord = metaType.get(metaKey) || null;
  return <Cell>{metaRecord ? metaRecord.get('value') : ''}</Cell>;
};
