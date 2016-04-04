import React from 'react';
import {filteredURL} from '../api';

export const ChangesExportLink = ({summaryFilter, children}) => {
  const url = filteredURL('changes.csv', summaryFilter);
  return <a href={url} download={true}>{children}</a>;
};

export default ChangesExportLink;
