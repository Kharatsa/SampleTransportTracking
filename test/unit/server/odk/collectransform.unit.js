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
    `${path.join(__dirname, '..', '..', '..', 'data', 'sdepart2.xml')}`
  );

  const expectedSampleIds1 = [
    {stId: '4809505262', labId: null},
    {stId: '016dbb1de', labId: null}
  ];

  it('should parse sample depart sample ids', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.sampleIds)
    ).to.eventually.deep.equal(expectedSampleIds1)
  );

  // const expectedMeta1 = [
  //   {type: 'facility', key: 'GHI', value: null, valueType: 'string'},
  //   {type: 'person', key: 'PER1', value: null, valueType: 'string'},
  //   {type: 'region', key: 'BR', value: null, valueType: 'string'},
  //   {type: 'status', key: 'OK', value: null, valueType: 'string'},
  //   {type: 'status', key: 'BRK', value: null, valueType: 'string'},
  //   {type: 'artifact', key: 'FORM', value: null, valueType: 'string'},
  //   {type: 'artifact', key: 'BLOOD', value: null, valueType: 'string'},
  //   {type: 'artifact', key: 'DBS', value: null, valueType: 'string'}
  // ];

  // it('should parse sample depart metadata codes', () =>
  //   expect(
  //     transform.collectSubmission(departXML)
  //     .then(transform.metadata)
  //   ).to.eventually.deep.equal(expectedMeta1)
  // );

  const expectedArtifacts1 = [
    {stId: '4809505262', labId: null, artifactType: 'FORM'},
    {stId: '4809505262', labId: null, artifactType: 'BLOOD'},
    {stId: '016dbb1de', labId: null, artifactType: 'FORM'},
    {stId: '016dbb1de', labId: null, artifactType: 'DBS'}
  ];

  it('should parse sample depart artifacts', () =>
    expect(
      transform.collectSubmission(departXML)
      .then(transform.artifacts)
      .tap(result => console.log('transform.artifacts parsed', result))
    ).to.eventually.deep.equal(expectedArtifacts1)
  );

  const expectedChanges1 = [
    {
      stId: '4809505262',
      labId: null,
      statusDate: new Date('2016-02-18T06:18:54.745+02:00'),
      stage: 'sdepart',
      artifactType: 'FORM',
      region: 'BB',
      facility: 'DEF',
      person: 'PER1',
      status: 'OK'
    } , {
      stId: '4809505262',
      labId: null,
      statusDate: new Date('2016-02-18T06:18:54.745+02:00'),
      stage: 'sdepart',
      artifactType: 'BLOOD',
      region: 'BB',
      facility: 'DEF',
      person: 'PER1',
      status: 'OK'
    }, {
      stId: '016dbb1de',
      labId: null,
      statusDate: new Date('2016-02-18T06:18:54.745+02:00'),
      stage: 'sdepart',
      artifactType: 'FORM',
      region: 'BB',
      facility: 'DEF',
      person: 'PER1',
      status: 'OK'
    }, {
      stId: '016dbb1de',
      labId: null,
      statusDate: new Date('2016-02-18T06:18:54.745+02:00'),
      stage: 'sdepart',
      artifactType: 'DBS',
      region: 'BB',
      facility: 'DEF',
      person: 'PER1',
      status: 'OVERFLOW'
    }, {
      stId: '016dbb1de',
      labId: null,
      statusDate: new Date('2016-02-18T06:18:54.745+02:00'),
      stage: 'sdepart',
      artifactType: 'DBS',
      region: 'BB',
      facility: 'DEF',
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
});
