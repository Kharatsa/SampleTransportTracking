import React, {PropTypes} from 'react';

export const testButton = ({children}) => {
  // Center the button within the SideMenu
  const wrapperStyle = {'textAlign': 'center'};
  const innerStyle = {'display': 'inline-block'};

  return (
    <div style={wrapperStyle}>
      <div style={innerStyle}>
        <button className='pure-button'>
          {children}
        </button>
      </div>
    </div>
  );
};

testButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default testButton;
