import React, {PropTypes} from 'react';
import {toLocaleStringSupportsLocales} from '../../util/stringformat.js';

export const PageSummary = ({total, itemCount, currentPage, desc='items'}) => {
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

PageSummary.propTypes = {
  total: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  desc: PropTypes.string.isRequired,
};

export default PageSummary;
