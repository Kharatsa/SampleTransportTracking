import React from 'react';

export const MetaText = ({metadata, metaKey}) => {
  const entry = metadata.get(metaKey);
  return <span>{entry ? entry.get('value') : ''}</span>;
};

export default MetaText;
