import React from 'react';

export const MissingRoute = () => {
  return (
    <div>Unrecognized route: {window.location.pathname}</div>
  );
};

export default MissingRoute;
