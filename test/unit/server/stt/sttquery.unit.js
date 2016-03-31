'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sampleidsquery = require('app/server/stt/clients/sampleids/' +
                               'sampleidsquery.js');

describe('Sample Transport Tracking Query Builders', () => {

  const ids = ['abc', 'def', null, undefined, '', [], {}];
  const expectedEitherIdsWhere = {$or: [
    {stId: 'abc'},
    {stId: 'def'},
    {labId: 'abc'},
    {labId: 'def'},
    {uuid: 'abc'},
    {uuid: 'def'}
  ]};

  it('should build sampleIds w/ eitherId query where clause', () =>
    expect(
      sampleidsquery.eitherIds(ids)
    ).to.eventually.deep.equal(expectedEitherIdsWhere)
  );

  it('should build metadata keys where clause');
  it('should build sampleIds w/ stIds query where clause');
  it('should throw an error for missing sampleIds props');

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
