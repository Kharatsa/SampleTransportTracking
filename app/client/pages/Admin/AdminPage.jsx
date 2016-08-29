import React, {PropTypes} from 'react';
import {AdminContainer} from '../../containers/Admin';
import {AdminHeaderMenu} from '../../components/Admin';
import {routerPropTypes} from '../../util/proptypes.js';

export const AdminPage = ({children, location, route, routeParams}) => {
  return (
    <div>
      <AdminContainer/>
      <AdminHeaderMenu location={location} route={route} routeParams={routeParams} />
      <div className="pure-u-1-24 pure-u-md-1-12" />
      <div className="pure-u-1 pure-u-md-5-6">
        {children}
      </div>
      <div className="pure-u-1-24 pure-u-md-1-12" />
    </div>
  );
};

AdminPage.propTypes = {
  children: PropTypes.node,
  ...routerPropTypes
};

export default AdminPage;
