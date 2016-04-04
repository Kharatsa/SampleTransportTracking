import React from 'react';
import Link from 'react-router/lib/Link';
import {Cell} from 'fixed-data-table';
import MetaText from './MetaText.jsx';
import {shortFormatDateTime} from '../util/stringformat.js';

export const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>{data[rowIndex][col]}</Cell>
);

export const LinkCell = ({rowIndex, data, col, route, ...props}) =>  {
  const value = data[rowIndex][col] || '';
  const linkTo = `${route}/${value}`;
  if (value) {
    return <Cell {...props}><Link to={linkTo}>{value}</Link></Cell>;
  }
  return <TextCell {...props} rowIndex={rowIndex} data={data} col={col} />;
};

export const DateCell = ({rowIndex, data, col, ...props}) => {
  const dateStr = data[rowIndex][col];
  return (<Cell {...props}>{shortFormatDateTime(dateStr)}</Cell>);
};

export const MetadataCell = ({rowIndex, data, col, metadata, ...props}) => {
  const metaKey = data[rowIndex][col];
  return (
      <Cell {...props}>
        <MetaText metadata={metadata} metaKey={metaKey} />
      </Cell>);
};
