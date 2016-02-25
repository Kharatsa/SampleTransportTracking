'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

export const SampleBasics = ({stId, labId, created}) => (
  <div className='pure-g sample-summary main'>
    <div className='pure-u-1 pure-u-md-1-3'>
      <h3>ST ID</h3>
      <p>{stId}</p>
    </div>
    <div className='pure-u-1 pure-u-md-1-3'>
      <h3>Lab ID</h3>
      <p>{labId}</p>
    </div>
    <div className='pure-u-1 pure-u-md-1-3'>
      <h3>Created</h3>
      <p>{created}</p>
    </div>
  </div>
);

export default SampleBasics;