import React, {PropTypes} from 'react';
import classnames from 'classnames';

export const InfoPanel = ({title, color, children}) => {
  color = color || 'grey';

  const headerTextClass = classnames({
    'white-text': color !== 'grey'
  });

  return (
    <div className='info-panel'>
      <div className={`info-panel-title ${color}-bg`}>
        <span className={headerTextClass}>{title}</span>
      </div>
      <div className='info-panel-body'>{children}</div>
    </div>
  );
};

InfoPanel.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.any
};

export default InfoPanel;
