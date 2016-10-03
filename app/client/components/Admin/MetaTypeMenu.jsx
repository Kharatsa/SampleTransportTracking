import React from 'react';
import MenuLink from './MenuLink.jsx';
import {META_TYPES_ORDER} from '../../../common/sttworkflow.js';

// TODO(sean): get active meta type highlight working

export const MetaTypeMenu = () => {
  const metaLinks = META_TYPES_ORDER.map((type, i) => {
    const path = `/admin/meta/${type}`;
    const key = `ml-${type}${i}`;
    return <MenuLink key={key}
            path={path.toLowerCase()}
            label={type.toUpperCase()}/>;
  });

  return (
    <header>
      <nav id='meta-header'>
        <div className='pure-menu pure-menu-horizontal'>
          <ul className='pure-menu-list'>
            {metaLinks}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default MetaTypeMenu;
