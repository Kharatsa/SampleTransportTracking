import React, {PropTypes} from 'react';

export const InfoBox = ({header, children}) => {
  return (
    <div className='infobox'>
      <div className='infobox-header'>{header}</div>
      <div className='infobox-value'>{children}</div>
    </div>
  );
};

InfoBox.propTypes = {
  header: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default InfoBox;
