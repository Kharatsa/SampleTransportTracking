'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
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

  // const body = `No ST ID or Lab ID "${sampleId || ''}" exists ` +
  //              `in the Sample Tracking database`;

  return (
    <div className='pure-g'>
      <div className={gridClass} />
      <div className={gridClass}>
        <InfoPanel title={title} body={body} />
      </div>
      <div className={gridClass} />
    </div>
  );
};

export default MissingSampleDetail;
