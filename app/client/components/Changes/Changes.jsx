import React, {PropTypes} from 'react';
import ChangesTable from './ChangesTable';

export const Changes = (props) => {
  return (
    <div className='content'>
      <ChangesTable {...props} />
    </div>
  );
};

Changes.propTypes = {
  // TODO(sean)
};

export default Changes;
