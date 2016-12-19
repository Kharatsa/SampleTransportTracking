import React, {PropTypes} from 'react';

export const TabPanel = ({header, children}) => {
  return (
    <div className='hero-data'>
      <div className='hero-data-header'>{header}</div>
      <div className='hero-data-value'>{children}</div>
    </div>
  );
};

TabPanel.propTypes = {
  header: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default TabPanel;