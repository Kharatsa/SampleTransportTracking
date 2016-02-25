'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import SamplePanelRow from './SamplePanelRow.jsx';
import InfoPanel from '../InfoPanel.jsx';

export const SampleRequest = ({pickup, delivery, facilities}) => {
  // TODO: add rider/person row?
  let pickupElem;
  let deliveryElem;

  if (pickup) {
    const facility = facilities.get(pickup.get('facility'));
    pickupElem = (
      <SamplePanelRow
          left='Pickup'
          center={facility ? facility.get('value') : null}
          right={pickup.get('statusDate')} />);
  } else {
    pickupElem = <SamplePanelRow left='Pickup' />;
  }

  if (delivery) {
    const facility = facilities.get(delivery.get('facility'));
    deliveryElem = (
      <SamplePanelRow
          left='Delivery'
          center={facility ? facility.get('value') : null}
          right={delivery.get('statusDate')} />);
  } else {
    deliveryElem = <SamplePanelRow left='Delivery' />;
  }

  const body = (
    <ul className='table-list'>
      <li>{pickupElem}</li>
      <li>{deliveryElem}</li>
    </ul>
  );

  return <InfoPanel title='Request' body={body} color='green' />;
};

export default SampleRequest;
