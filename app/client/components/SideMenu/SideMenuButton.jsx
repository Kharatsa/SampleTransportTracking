'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

export const SideMenuButton = (props) => {
  // Center the button within the SideMenu
  const wrapperStyle = {'textAlign': 'center'};
  const innerStyle = {'display': 'inline-block'};

  return (
    <div style={wrapperStyle}>
      <div style={innerStyle}>
        <button className='pure-button'>
          {props.children}
        </button>
      </div>
    </div>
  );
};

export default SideMenuButton;
