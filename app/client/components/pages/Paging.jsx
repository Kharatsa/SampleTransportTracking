'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import PageButton from './PageButton.jsx';
import PageSummary from './PageSummary.jsx';

// const MAX_BUTTON_COUNT = 5;

export default ({total, perPage, currentPage, fetchPage}) => {
  const pageCount = Math.ceil(total / perPage);

  const buttonsStyle = {
    textAlign: 'right'
  }

  return (
    <div className='pure-g'>
      <div className='pure-u-1-2'>
        <PageSummary
          total={total}
          itemCount={perPage}
          currentPage={currentPage}
          desc={'Changes'} />
      </div>
      <div className='pure-u-1-2' style={buttonsStyle}>
        <PageButton
          fetchPage={fetchPage}
          disabled={currentPage === 1}
          toPage={currentPage - 1}
          text='Previous' />
          {' '}
        <PageButton
          fetchPage={fetchPage}
          disabled={currentPage === pageCount}
          toPage={currentPage + 1}
          text='Next' />
      </div>
    </div>
  );
};
