'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const config = require('app/config');
const metamodels = require('app/server/stt/models/metadata');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/clients/sttclient.js');

describe('Sample Transport Tracking Sample IDs client', () => {
  const sampleIds = [
    {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1',
      stId: 'stt1',
      labId: null,
      origin: 'ABC',
      outstanding: true
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
      stId: 'stt2',
      labId: null,
      origin: 'ABC',
      outstanding: true
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
      stId: 'stt3',
      labId: 'LAB0000001',
      origin: 'ABC',
      outstanding: true
    }
  ];

  let client = null;
  let models = null;
  before(done => {
    storage.init({config: config.db});
    storage.loadModels(metamodels);
    storage.loadModels(sttmodels);
    client = sttclient({db: storage.db, models: storage.models});
    const prepareserver = require('app/server/prepareserver.js');
    const testmeta = require('../../../utils/testmeta.js');
    models = storage.models;
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => prepareserver())
    .then(() => testmeta.load())
    .then(() => models.SampleIds.bulkCreate(sampleIds))
    .then(() => done());
  });

  const stIds1 = [
    {stId: 'stt1'},
    {stId: 'stt2'},
    {stId: 'stt5'}
  ];

  const expected1 = [
    sampleIds[0],
    sampleIds[1]
  ];

  it('should retrieve sample ids by stid', () =>
    expect(
      client.sampleIds.byStIds({data: stIds1, omitDateDBCols: true})
    ).to.eventually.deep.equal(expected1)
  );
});
