import React, {PropTypes} from 'react';
import {App, ParseQuery} from '../containers';

export const AppPage = ({children}) => {
  return (
    <App>
      <ParseQuery>
        {children}
      </ParseQuery>
    </App>
  );
};

AppPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppPage;
