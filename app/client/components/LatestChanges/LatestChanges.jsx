'use strict';

import React from 'react';
import ChangesTable from '../ChangesTable.jsx';
import Paging from '../pagination/Paging.jsx';
import WindowSizeListener from '../../containers/wrap/WindowSizeListener.jsx';

const FlexChangesTable = WindowSizeListener(ChangesTable);

export default React.createClass({
  render() {
    const {changesTotal, changeIds, page} = this.props;
    const {fetchChanges} = this.props.actions;
    const fetchPage = fetchChanges || function() {};

    return (
      <div className='main'>
        <FlexChangesTable {...this.props} />
        <Paging
          fetchPage={fetchPage}
          total={changesTotal}
          perPage={changeIds.size}
          currentPage={page.get('current')} />
      </div>
    );
  }
});
