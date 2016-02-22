'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import ChangesTable from '../components/ChangesTable.jsx';
import Paging from '../components/pages/Paging.jsx';

export default React.createClass({
  render() {
    const {changesTotal, changeIds, page} = this.props;
    const {fetchChanges} = this.props.actions;
    const fetchPage = fetchChanges || function() {};

    return (
      <div>
        <ChangesTable {...this.props} />
        <Paging
          fetchPage={fetchPage}
          total={changesTotal}
          perPage={changeIds.size}
          currentPage={page.get('current')} />
      </div>
    );
  }
});
