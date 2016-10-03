import React, {PropTypes} from 'react';
import {MetaTypeMenu} from '../../components/Admin';
import {MetaTypeContainer} from '../../containers/Admin';

export const MetaListPage = ({routeParams}) => {
  // TODO(sean): meta type submenu
  return (
    <div>
      <MetaTypeMenu/>
      <MetaTypeContainer routeParams={routeParams}/>
    </div>
  );
};

MetaListPage.propTypes = {
  routeParams: PropTypes.object.isRequired,
};

export default MetaListPage;
