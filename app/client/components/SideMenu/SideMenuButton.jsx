import React, {PropTypes} from 'react';

export const SideMenuButton = ({children}) => {
  // Center the button within the SideMenu
  const wrapperStyle = {'textAlign': 'center'};
  const innerStyle = {'display': 'inline-block'};

  return (
    <div style={wrapperStyle}>
      <div style={innerStyle}>
        <button className='pure-button menu-button'>
          {children}
        </button>
      </div>
    </div>
  );
};

SideMenuButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SideMenuButton;
