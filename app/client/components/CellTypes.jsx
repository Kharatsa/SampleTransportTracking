'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Cell} from 'fixed-data-table';

export const TextCell = ({rowIndex, data, col}) => (
  <Cell>{data[rowIndex][col]}</Cell>
);

export const DateCell = ({rowIndex, data, col}) => (
  <Cell>{data[rowIndex][col].toLocaleString()}</Cell>
);

export const MetadataCell = ({rowIndex, data, col, meta, type}) => {
  const metaType = meta.get(type);
  const metaKey = data[rowIndex][col];
  const metaRecord = metaType.get(metaKey) || null;
  return <Cell>{metaRecord ? metaRecord.get('value') : ''}</Cell>;
};
