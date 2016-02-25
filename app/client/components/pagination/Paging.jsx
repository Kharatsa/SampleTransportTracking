'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import PageButton from './PageButton.jsx';
import PageSummary from './PageSummary.jsx';

// const MAX_BUTTON_COUNT = 5;

export default ({total, perPage, currentPage, fetchPage}) => {
  const pageCount = Math.ceil(total / perPage);

  const buttonsStyle = {
    textAlign: 'right'
  };

  const prevPageLink = `/changes/${currentPage - 1}`;
  const nextPageLink = `/changes/${currentPage + 1}`;

  return (
    <div className='pure-g panel'>
      <div className='pure-u-1-2'>
        <PageSummary
          total={total}
          itemCount={perPage}
          currentPage={currentPage}
          desc={'Changes'} />
      </div>
      <div className='pure-u-1-2' style={buttonsStyle}>
        <PageButton
          linkTo={prevPageLink}
          fetchPage={fetchPage}
          disabled={currentPage === 1}
          text='Previous' />
          {' '}
        <PageButton
          linkTo={nextPageLink}
          fetchPage={fetchPage}
          disabled={currentPage === pageCount}
          text='Next' />
      </div>
    </div>
  );
};