'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SamplePanelRow from './SamplePanelRow.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleRequest = ({
  label, color,
  pickupStageName, deliveryStageName,
  changesIdsByStage, changesById,
  facilities, people
}) => {
  const pickupChangeIds = changesIdsByStage.get(pickupStageName);
  const deliveryChangeIds = changesIdsByStage.get(deliveryStageName);
  let pickup = null;
  let delivery = null;
  if (pickupChangeIds && pickupChangeIds.size) {
    pickup = changesById.get(pickupChangeIds.first());
  }
  if (deliveryChangeIds) {
    delivery = changesById.get(deliveryChangeIds.first());
  }

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

  return <InfoPanel title={label} body={body} color={color} />;
};

export default SampleRequest;
