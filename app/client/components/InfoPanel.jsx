import React from 'react';
import classnames from 'classnames';

export const InfoPanel = ({title, body, color}) => {
  color = color || 'grey';

  const headerTextClass = classnames({
    'white-text': color !== 'grey'
  });

  return (
    <div className='info-panel'>
      <div className={`info-panel-title ${color}-bg`}>
        <span className={headerTextClass}>{title}</span>
      </div>
      <div className='info-panel-body'>{body}</div>
    </div>
  );
};

export default InfoPanel;
