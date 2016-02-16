'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const transform = require('app/server/odk/collect/collecttransform.js');

describe('ODK Collect Tranforms', () => {

  const departXML = fs.readFileSync(
    `${path.join(__dirname, '..', '..', '..', 'data', 'sdepart.xml')}`
  );

  // const departXML = (
  //   '<?xml version=\'1.0\' ?>' +
  //   '<sdepart id="sdepart" version="3">' +
  //     '<start>2016-01-22T22:15:40.838-05</start>' +
  //     '<end>2016-01-22T22:17:49.495-05</end>' +
  //     '<deviceid>867979020085780</deviceid>' +
  //     '<simserial>8901260971103975692</simserial>' +
  //     '<person>md563</person>' +
  //     '<region>MSR</region>' +
  //     '<facility>SPR</facility>' +
  //     '<srepeat>' +
  //       '<stid>9781933988696</stid>' +
  //       '<stype>form</stype>' +
  //       '<condition>ok</condition>' +
  //     '</srepeat>' +
  //     '<srepeat>' +
  //       '<stid>1c92a4637</stid>' +
  //       '<stype>blood</stype>' +
  //       '<condition>soiled</condition>' +
  //     '</srepeat>' +
  //     '<srepeat>' +
  //       '<stid>9781933988696</stid>' +
  //       '<stype>dbs</stype>' +
  //       '<condition>ok</condition>' +
  //     '</srepeat>' +
  //     '<store_gps>40.76310203 -73.9617425 171.0 23.0</store_gps>' +
  //     '<meta>' +
  //       '<instanceID>uuid:dbd663ba-10ed-4b36-bbc1-f61557477646</instanceID>' +
  //     '</meta>' +
  //   '</sdepart>'
  // );

  const expectedSampleIds1 = [
    {stId: '9781933988696', labId: null},
    {stId: '1c92a4637', labId: null}
  ];

  it('should parse sample depart sample ids', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds1)
  );

  const expectedMeta1 = [
    {type: 'facility', key: 'GHI', value: null, valueType: 'string'},
    {type: 'person', key: 'PER1', value: null, valueType: 'string'},
    {type: 'region', key: 'BR', value: null, valueType: 'string'},
    {type: 'status', key: 'OK', value: null, valueType: 'string'},
    {type: 'status', key: 'BRK', value: null, valueType: 'string'},
    {type: 'artifact', key: 'FORM', value: null, valueType: 'string'},
    {type: 'artifact', key: 'BLOOD', value: null, valueType: 'string'},
    {type: 'artifact', key: 'DBS', value: null, valueType: 'string'}
  ];

  it('should parse sample depart metadata codes', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.metadata)
    ).to.eventually.deep.equal(expectedMeta1)
  );

  const expectedArtifacts1 = [
    {stId: '9781933988696', labId: null, artifactType: 'FORM'},
    {stId: '1c92a4637', labId: null, artifactType: 'BLOOD'},
    {stId: '9781933988696', labId: null, artifactType: 'DBS'}
  ];

  it('should parse sample depart artifacts', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.artifacts)
    ).to.eventually.deep.equal(expectedArtifacts1)
  );

  const expectedChanges1 = [
    {
      stId: '9781933988696',
      labId: null,
      statusDate: new Date('2016-01-22T22:17:49.495-05:00'),
      stage: 'sdepart',
      artifactType: 'FORM',
      region: 'BR',
      facility: 'GHI',
      person: 'PER1',
      status: 'OK'
    } , {
      stId: '1c92a4637',
      labId: null,
      statusDate: new Date('2016-01-22T22:17:49.495-05:00'),
      stage: 'sdepart',
      artifactType: 'BLOOD',
      region: 'BR',
      facility: 'GHI',
      person: 'PER1',
      status: 'BRK'
    }, {
      stId: '9781933988696',
      labId: null,
      statusDate: new Date('2016-01-22T22:17:49.495-05:00'),
      stage: 'sdepart',
      artifactType: 'DBS',
      region: 'BR',
      facility: 'GHI',
      person: 'PER1',
      status: 'OK'
    }
  ];

  it('should parse sample depart changes', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.changes)
    ).to.eventually.deep.equal(expectedChanges1)
  );

  it('should parse sample arrive sample ids');
  it('should parse sample arrive TODO');

  it('should parse result depart sample ids');
  it('should parse result depart TODO');

  it('should parse result arrive sample ids');
  it('should parse result arrive TODO');

  // it('should parse sample depart TODO');
  // it('should parse sample arrive TODO');
  // it('should parse result depart TODO');
  // it('should parse result arrive TODO');
});
