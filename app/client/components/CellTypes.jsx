'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Link from 'react-router/lib/Link';
import {Cell} from 'fixed-data-table';
import MetaText from './MetaText.jsx';
import {shortFormatDateTime} from '../util/stringformat.js';

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
  const dateStr = data[rowIndex][col];
  return (<Cell>{shortFormatDateTime(dateStr)}</Cell>);
};

export const MetadataCell = ({rowIndex, data, col, metadata}) => {
  const metaKey = data[rowIndex][col];
  return <Cell><MetaText metadata={metadata} metaKey={metaKey} /></Cell>;
};
