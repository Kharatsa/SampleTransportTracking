'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Link from 'react-router/lib/Link';

export const ChangesButton = () => {
  const buttonStyle = {display: 'inline-block'};

  return (
    <Link to="/changes">
      <button className='pure-button' style={buttonStyle}>
        View Changes
      </button>
    </Link>
  );
};

export default ChangesButton;
