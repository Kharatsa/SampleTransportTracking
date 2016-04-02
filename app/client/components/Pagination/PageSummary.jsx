'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {toLocaleStringSupportsLocales} from '../../util/stringformat.js';

export default ({total, itemCount, currentPage, desc='items'}) => {
  const first = (itemCount * (currentPage - 1)) + 1;
  const maybeLast = itemCount * currentPage;
  const last = maybeLast < total ? maybeLast : total;

  let totalStr;
  let firstStr;
  let lastStr;
  if (toLocaleStringSupportsLocales()) {
    totalStr = (new Number(total)).toLocaleString();
    firstStr = (new Number(first)).toLocaleString();
    lastStr = (new Number(last)).toLocaleString();
  } else {
    totalStr = total.toString();
  }

  return (
    <div>
      {`Showing ${firstStr} to ${lastStr} of ${totalStr} ${desc}`}
    </div>)
  ;
};
