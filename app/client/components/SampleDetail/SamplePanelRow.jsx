'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

export const SamplePanelRow = ({left, center, right}) => {
  return (
    <div className='pure-g'>
      <div className='pure-u-1-6'><strong>{left}</strong></div>
      <div className='pure-u-3-8'>{center}</div>
      <div className='pure-u-3-8'>{right}</div>
    </div>
  );
};

export default SamplePanelRow;
