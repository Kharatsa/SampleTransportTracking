'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
// const BPromise = require('bluebird');
// const string = require('app/common/string.js');
const transform = require('app/server/odk/collect/collecttransform.js');

const DEBUG = (message, value) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`DEBUG ${message}`);
    console.dir(value, {depth: 10});
  }
};

describe('ODK Collect Tranforms', () => {
  const departXML = (
    '<?xml version=\'1.0\' ?>' +
    '<sdepart id="sdepart" version="3">' +
      '<start>2016-01-22T22:15:40.838-05</start>' +
      '<end>2016-01-22T22:17:49.495-05</end>' +
      '<deviceid>867979020085780</deviceid>' +
      '<simserial>8901260971103975692</simserial>' +
      '<person>md563</person>' +
      '<region>MSR</region>' +
      '<facility>SPR</facility>' +
      '<srepeat>' +
        '<stid>9781933988696</stid>' +
        '<stype>form</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>1c92a4637</stid>' +
        '<stype>blood</stype>' +
        '<condition>soiled</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>9781933988696</stid>' +
        '<stype>dbs</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<store_gps>40.76310203 -73.9617425 171.0 23.0</store_gps>' +
      '<meta>' +
        '<instanceID>uuid:dbd663ba-10ed-4b36-bbc1-f61557477646</instanceID>' +
      '</meta>' +
    '</sdepart>'
  );

  const expectedSampleIds1 = [
    {stId: '9781933988696', labId: null},
    {stId: '1c92a4637', labId: null}
  ];

  it('should parse sample depart sample ids', () =>
    expect(
      transform.collectSubmission(departXML)
      // .tap(r => DEBUG('collectSubmission results', r))
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds1)
  );

  const expectedMeta1 = [
    {type: 'facility', key: 'SPR', value: null, valueType: 'string'},
    {type: 'person', key: 'md563', value: null, valueType: 'string'},
    {type: 'region', key: 'MSR', value: null, valueType: 'string'},
    {type: 'status', key: 'ok', value: null, valueType: 'string'},
    {type: 'status', key: 'soiled', value: null, valueType: 'string'},
    {type: 'artifact', key: 'form', value: null, valueType: 'string'},
    {type: 'artifact', key: 'blood', value: null, valueType: 'string'},
    {type: 'artifact', key: 'dbs', value: null, valueType: 'string'}
  ];

  it('should parse sample depart metadata codes', () =>
    expect(
      transform.collectSubmission(departXML)
      // .tap(r => DEBUG('collectSubmission results', r))
      .then(transform.metadata)
    ).to.eventually.deep.equal(expectedMeta1)
  );

  const expectedArtifacts1 = [
    {stId: '9781933988696', labId: null, artifactType: 'form'},
    {stId: '1c92a4637', labId: null, artifactType: 'blood'},
    {stId: '9781933988696', labId: null, artifactType: 'dbs'}
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
      artifactType: 'form',
      region: 'MSR',
      facility: 'SPR',
      person: 'md563',
      status: 'ok'
    } , {
      stId: '1c92a4637',
      labId: null,
      statusDate: new Date('2016-01-22T22:17:49.495-05:00'),
      stage: 'sdepart',
      artifactType: 'blood',
      region: 'MSR',
      facility: 'SPR',
      person: 'md563',
      status: 'soiled'
    }, {
      stId: '9781933988696',
      labId: null,
      statusDate: new Date('2016-01-22T22:17:49.495-05:00'),
      stage: 'sdepart',
      artifactType: 'dbs',
      region: 'MSR',
      facility: 'SPR',
      person: 'md563',
      status: 'ok'
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
