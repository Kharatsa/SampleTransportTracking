'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sttquery = require('app/server/stt/sttquery.js');

describe('Sample Transport Tracking Query Builders', () => {

  const meta1 = [
    {type: 'artifact', key: 'ABC', value: 'YOLO', valueType: 'string'},
    {type: 'artifact', key: 'DEF', value: 'YOYO', valueType: 'string'},
    {type: 'person', key: 'GHI', value: 'SALADBOWL', valueType: 'string'}
  ];

  const expectedMeta1 = {$or: [
    {$and: [{type: 'artifact'}, {key: 'ABC'}]},
    {$and: [{type: 'artifact'}, {key: 'DEF'}]},
    {$and: [{type: 'person'}, {key: 'GHI'}]}
  ]};

  it('should build metadata w/ keys and types query where clause', () =>
    expect(
      sttquery.metadata.typesAndKeys(meta1)
    ).to.eventually.deep.equal(expectedMeta1)
  );

  const meta2 = [
    meta1[0],
    {key: 'DEF', value: 'YOYO', valueType: 'string'},
    meta1[2]
  ];

  it('should throw an error for missing metadata keys or types', () =>
    expect(
      sttquery.metadata.typesAndKeys(meta2)
    ).to.eventually.be.rejectedWith(Error)
  );

  const metaType = 'artifact';
  const expectedMeta2 = {type: 'artifact'};

  it('should build metadata w/ types query where clause', () =>
    expect(
      sttquery.metadata.type(metaType)
    ).to.eventually.deep.equal(expectedMeta2)
  );

  it('should build sampleIds w/ stIds query where clause');
  it('should throw an error for missing sampleIds props');

  const ids = ['abc', 'def', null, undefined, '', [], {}];
  const expectedEitherIdsWhere = {$or: [
    {stId: 'abc'},
    {stId: 'def'},
    {labId: 'abc'},
    {labId: 'def'}
  ]};

  it('should build sampleIds w/ eitherId query where clause', () =>
    expect(
      sttquery.sampleIds.eitherIds(ids)
    ).to.eventually.deep.equal(expectedEitherIdsWhere)
  );

  it('should build labTests w/ types and sampleIds query where clause');
  it('should build labTests w/ sampleIds query where clause');
  it('should throw an error for missing labTests types or sampleIds');
  it('should throw an error for missing labTests sampleIds');

  it('should build artifacts w/ types and sampleIds query where clause');
  it('should throw an error for missing artifacts types or sampleIds');

  it('should build changes w/ tests and dates query where clause');
  it('should build changes w/ artifacts and dates query where clause');
  it('should throw an error for missing changes tests and dates');
  it('should throw an error for missing changes artifacts and dates');
});
