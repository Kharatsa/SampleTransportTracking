import React from 'react';
import {shortFormatDateTime} from '../../util/stringformat.js';

export const SamplePanelRow = ({label, change, facilities, people}) => {
  let facilityName = '';
  let personName = '';
  let statusDate = '';

  if (change) {
    const facilityKey = change.get('facility');
    const facility = facilities.get(facilityKey);
    facilityName = facility ? facility.get('value') : null;

    const personKey = change.get('person');
    const person = people.get(personKey);
    personName = person ? person.get('value') : null;

    statusDate = shortFormatDateTime(change.get('statusDate'));
  }

  return (
    <div className='pure-g'>
      <div className='pure-u-1 pure-u-md-3-24'><strong>{label}</strong></div>
      <div className='pure-u-1 pure-u-md-7-24'>{facilityName}</div>
      <div className='pure-u-1 pure-u-md-7-24'>{personName}</div>
      <div className='pure-u-1 pure-u-md-7-24'>{statusDate}</div>
    </div>
  );
};

export default SamplePanelRow;
