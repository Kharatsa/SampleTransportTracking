import React, {PropTypes} from 'react';
import PageButton from './PageButton.jsx';
import PageSummary from './PageSummary.jsx';

export const Paging = ({currentPage, total, perPage}) => {
  const pageCount = Math.ceil(total / perPage);

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
          to='/changes/'
          pageNum={currentPage - 1}
          disabled={currentPage === 1}
          text='Previous' />
          {' '}
        <PageButton
          to='/changes/'
          pageNum={currentPage + 1}
          disabled={currentPage === pageCount}
          text='Next' />
      </div>
    </div>
  );
};

Paging.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default Paging;
