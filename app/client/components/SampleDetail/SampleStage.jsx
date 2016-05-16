import React from 'react';
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

  return (
    <InfoPanel title={label} color={color}>
      <ul className='table-list'>
        <li>
          <div className='pure-g'>
            <div className='pure-u-1 pure-u-md-3-24'><strong>Stage</strong></div>
            <div className='pure-u-1 pure-u-md-7-24'><strong>Facility</strong></div>
            <div className='pure-u-1 pure-u-md-7-24'><strong>Rider</strong></div>
            <div className='pure-u-1 pure-u-md-7-24'><strong>StatusDate</strong></div>
          </div>
        </li>
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
    </InfoPanel>
    );
};

export default SampleRequest;
