'use strict';

import React from 'react';
import ChangesTable from '../ChangesTable.jsx';
import Paging from '../pagination/Paging.jsx';

export default React.createClass({
  render() {
    const {changesTotal, changeIds, page} = this.props;
    const {fetchChanges} = this.props.actions;
    const fetchPage = fetchChanges || function() {};

    return (
      <div className='main'>
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
