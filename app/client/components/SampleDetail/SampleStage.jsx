'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SamplePanelRow from './SamplePanelRow.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleRequest = ({
  label, color,
  pickupStageName, deliveryStageName,
  changesByStage, changesById,
  facilities, people
}) => {
  const pickupChangeIds = changesByStage.get(pickupStageName);
  const deliveryChangeIds = changesByStage.get(deliveryStageName);
  let pickup = null;
  let delivery = null;
  let change = null;
  if (pickupChangeIds && pickupChangeIds.size) {
    change = pickupChangeIds.first();
    pickup = change ? changesById.get(change.get('uuid')) : null;
  }
  if (deliveryChangeIds) {
    change = deliveryChangeIds.first();
    delivery = change ? changesById.get(change.get('uuid')) : null;
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
