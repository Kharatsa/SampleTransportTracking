import React, {PropTypes} from 'react';

export const Admin = ({children}) => {
  if (children) {
    return children;
  } else {
    return <div />;
  }
};

Admin.propTypes = {
  children: PropTypes.node,
};

export default Admin;
