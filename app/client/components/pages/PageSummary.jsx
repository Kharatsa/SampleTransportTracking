'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

// via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#Example:_Checking_for_support_for_locales_and_options_arguments
const toLocaleStringSupportsLocales = () => {
  let number = 0;
  try {
    number.toLocaleString('i');
  } catch (err) {
    return err.name === 'RangeError';
  }
  return false;
};

export default ({total=0, itemCount, currentPage, desc='items'}) => {
  const first = (itemCount * (currentPage - 1)) + 1;
  const last = itemCount * currentPage;
  const text = desc;

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
      {`Showing ${firstStr} to ${lastStr} of ${totalStr} ${text}`}
    </div>)
  ;
};
