import React, {PropTypes} from 'react';

export const DashboardPanel = ({heading, subheading=null, children}) => {
  const subheadingElem = (
    subheading === null ?
    null :
    <em>{subheading}</em>
  );

  return (
    <div className='widget'>
      <div className='widget-header'>
        <h3>{heading}</h3>
        {subheadingElem}
      </div>
      <div className='widget-content'>{children}</div>
    </div>
  );
};

DashboardPanel.propTypes = {
  heading: PropTypes.node.isRequired,
  subheading: PropTypes.node,
  children: PropTypes.node.isRequired
};

export default DashboardPanel;
