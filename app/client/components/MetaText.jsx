'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

export const MetaText = ({metadata, metaKey}) => {
  const entry = metadata.get(metaKey);
  return <span>{entry ? entry.get('value') : ''}</span>;
};

export default MetaText;
