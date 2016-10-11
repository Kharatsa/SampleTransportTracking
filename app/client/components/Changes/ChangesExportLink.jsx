import React, {PropTypes} from 'react';
import {filteredURL} from '../../api';

export const ChangesExportLink = ({summaryFilter, children}) => {
  const url = filteredURL('changes.csv', summaryFilter);
  return <a href={url} download={true}>{children}</a>;
};

ChangesExportLink.propTypes = {
  summaryFilter: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default ChangesExportLink;
