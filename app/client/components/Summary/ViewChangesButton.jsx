import React from 'react';
import Link from 'react-router/lib/Link';

const ChangesButton = () => {

  const buttonStyle = {
    display: 'inline-block'
  };

  return (
    <Link to="/changes">
      <button
        className='pure-button'
        style={buttonStyle}>
        View Changes
      </button>
    </Link>
  )
}

export default ChangesButton;
