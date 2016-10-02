import React, {PropTypes} from 'react';
import MenuLink from './MenuLink.jsx';

// TODO(sean): get active meta type highlight working

const metaTypes = [
  'regions',
  'facilities',
  'people',
  'stages',
  'statuses',
  'artifacts',
  'tests',
  'rejections',
];

export const MetaTypeMenu = () => {
  const metaLinks = metaTypes.map((type, i) => {
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
