'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {shortFormatDate} from '../../util/stringformat.js';

export const ChangeRefItem = ({
  changes, refItem, refType, refMeta, statuses
}) => {
  const change = changes.size ? changes.last() : null;
  const metaKey = refItem.get(refType);
  const refName = refMeta.get(metaKey).get('value');

  const stageName = change.get('stage');
  const statusDate = shortFormatDate(change.get('statusDate'));
  const statusKey = change.get('status');
  const statusName = statuses.get(statusKey).get('value');

  return (
    <div className='pure-g'>
      <div className='pure-u-1 pure-u-md-1-4'>{refName}</div>
      <div className='pure-u-1 pure-u-md-1-4'>{statusDate}</div>
      <div className='pure-u-1 pure-u-md-1-4'>{stageName}</div>
      <div className='pure-u-1 pure-u-md-1-4'>{statusName}</div>
    </div>
  );
};

export default ChangeRefItem;
