import React, {PropTypes} from 'react';
import InfoPanel from '../InfoPanel.jsx';

const gridClass = 'pure-u-1 pure-u-md-1-3';

export const MissingSampleDetail = ({sampleId}) => {
  sampleId = sampleId || '';

  const title = `Unrecognized Sample ID: ${sampleId}`;
  const body = (
      <div>
        <span>No ST ID or Lab ID </span>
          <span style={{fontWeight: 'bolder'}}>{sampleId}</span>
        <span> can be located in the Sample Tracking database.</span>
      </div>
  );

  return (
    <div className='pure-g'>
      <div className={gridClass} />
      <div className={gridClass}>
        <InfoPanel title={title}>{body}</InfoPanel>
      </div>
      <div className={gridClass} />
    </div>
  );
};

MissingSampleDetail.propTypes = {
  sampleId: PropTypes.string
};

export default MissingSampleDetail;
