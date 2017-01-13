import React, {PropTypes} from 'react';

export const App = ({children, ...others}) => {
  return <div id='app'>{children}</div>;
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
