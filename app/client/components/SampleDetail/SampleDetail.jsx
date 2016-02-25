'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SampleBasics from './SampleBasics.jsx';
import SampleRequest from './SampleRequest.jsx';
import SampleResults from './SampleResults.jsx';

export const SampleDetail = ({
  selectedSampleId, samplesById, changeIds, changesById, metadata
}) => {
  const sample = samplesById.get(selectedSampleId);

  if (sample) {
    const people = metadata.get('person');
    const facilities = metadata.get('facility');

    const stId = sample.get('stId');
    const labId = sample.get('labId');
    const created = sample.get('createdAt').toLocaleString();

    // TODO: fix
    const pickupId = changeIds.first();
    const pickupChange = pickupId ? changesById.get(pickupId) : null;

    const deliveryId = changeIds.get(1);
    const deliveryChange = deliveryId ? changesById.get(deliveryId) : null;

    return (
      <div>
        <SampleBasics stId={stId} labId={labId} created={created} />
        <div className='pure-g panel'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleRequest
                people={people}
                facilities={facilities}
                pickup={pickupChange}
                delivery={deliveryChange} />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <SampleResults metadata={metadata} />
          </div>
        </div>
      </div>
    );
  }

  return <span />;
};

export default SampleDetail;
