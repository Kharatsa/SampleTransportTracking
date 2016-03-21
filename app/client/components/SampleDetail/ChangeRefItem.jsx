'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import MetaText from '../MetaText.jsx';
import {shortFormatDate} from '../../util/stringformat.js';

export const ChangeRefItem = ({
  changes, refItem, refType, refMeta, statuses, stages
}) => {
  const change = changes.size ? changes.last() : null;
  const metaKey = refItem.get(refType);
  const statusDate = shortFormatDate(change.get('statusDate'));
  const stageKey = change.get('stage');
  const statusKey = change.get('status');

  return (
    <div className='pure-g'>
      <div className='pure-u-1 pure-u-md-1-4'>
        <MetaText metadata={refMeta} metaKey={metaKey} />
      </div>
      <div className='pure-u-1 pure-u-md-1-4'>{statusDate}</div>
      <div className='pure-u-1 pure-u-md-1-4'>
        <MetaText metadata={stages} metaKey={stageKey} />
      </div>
      <div className='pure-u-1 pure-u-md-1-4'>
        <MetaText metadata={statuses} metaKey={statusKey} />
      </div>
    </div>
  );
};

export default ChangeRefItem;
