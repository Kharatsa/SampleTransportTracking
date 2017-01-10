import React, {PropTypes} from 'react';

const SPRITE_PATH = '/icons/open-iconic.svg';

export const Iconic = ({name, className='', styles={}}) => {
  return (
    <svg
      className={`icon ${className}`}
      style={styles}
      viewBox='0 0 8 8'
    >
      <use
        xlinkHref={`${SPRITE_PATH}#${name}`}
        className={`icon-${name}`}
      />
    </svg>
  );
};

Iconic.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  styles: PropTypes.object,
};

export default Iconic;
