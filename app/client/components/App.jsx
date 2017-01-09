import React, {PropTypes} from 'react';

export const App = ({children}) => {
  return <div id='app'>{children}</div>;
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
