import React from 'react';
import PageButton from './PageButton.jsx';
import PageSummary from './PageSummary.jsx';

export const Paging = ({total, perPage, page}) => {
  const currentPage = page.get('current');
  const pageCount = Math.ceil(total / perPage);

  const prevPageLink = `/changes/${currentPage - 1}`;
  const nextPageLink = `/changes/${currentPage + 1}`;
  const buttonsStyle = {textAlign: 'right'};

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
          disabled={currentPage === 1}
          text='Previous' />
          {' '}
        <PageButton
          linkTo={nextPageLink}
          disabled={currentPage === pageCount}
          text='Next' />
      </div>
    </div>
  );
};

export default Paging;
