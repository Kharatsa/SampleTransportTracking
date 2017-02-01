import React, {PropTypes} from 'react';

export const ParseQuery = ({children}) => {
  return <div>{children}</div>;
};

ParseQuery.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ParseQuery;
