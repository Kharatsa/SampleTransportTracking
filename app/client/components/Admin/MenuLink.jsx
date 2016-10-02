import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';

export const MenuLink = ({path, label}) => {
  return (
    <li className='pure-menu-item'>
      <Link to={path} className='pure-menu-link'>{label}</Link>
    </li>
  );
};

MenuLink.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default MenuLink;
