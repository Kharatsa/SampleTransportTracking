import React from 'react';
import classnames from 'classnames';

export const DropdownParent = ({menuOpen, selectedName, children}) => {
  const parentClass = classnames({
    'pure-menu-has-children': true,
    'pure-menu-item': true,
    'pure-menu-active': menuOpen
  });

  return (
    <li className={parentClass} >
      <span id='menuLink1' className='pure-menu-link'>{selectedName}</span>
        <ul className='pure-menu-children'>
          {children}
        </ul>
    </li>
  );
};

export default DropdownParent;