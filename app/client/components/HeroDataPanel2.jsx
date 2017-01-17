import React, {PropTypes} from 'react';

export const HeroDataPanel2 = ({header, children}) => {
  return (
      <div className='hero-data-header2 hero-data'>{header}</div>
  );
};

HeroDataPanel2.propTypes = {
  header: PropTypes.node.isRequired,
};

export default HeroDataPanel2;
