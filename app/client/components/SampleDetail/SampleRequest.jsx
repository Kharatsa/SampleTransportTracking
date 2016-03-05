'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SamplePanelRow from './SamplePanelRow.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleRequest = ({changeIds, changesById, facilities, people}) => {
  // TODO: fix
  const pickupId = changeIds.get(0);
  const pickup = pickupId ? changesById.get(pickupId) : null;

  const deliveryId = changeIds.get(1);
  const delivery = deliveryId ? changesById.get(deliveryId) : null;

  const body = (
    <ul className='table-list'>
      <li>
        <SamplePanelRow
            label='Pickup'
            change={pickup}
            facilities={facilities}
            people={people} />
      </li>
      <li>
        <SamplePanelRow
            label='Delivery'
            change={delivery}
            facilities={facilities}
            people={people} />
      </li>
    </ul>
  );

  return <InfoPanel title='Request' body={body} color='green' />;
};

export default SampleRequest;
