import React, {PropTypes} from 'react';

export const HeroDataPanel = ({header, children}) => {
  return (
    <div className='hero-data'>
      <div className='hero-data-header'>{header}</div>
      <div className='hero-data-value'>{children}</div>
    </div>
  );
};

HeroDataPanel.propTypes = {
  header: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default HeroDataPanel;
