'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const config = require('app/config');
const storage = require('app/server/storage');
const metamodels = require('app/server/stt/models/metadata');
const sttmodels = require('app/server/stt/models');
const dbresult = require('app/server/storage/dbresult.js');

describe('Sample Transport Tracking Database Models', () => {
  var models;
  var Sequelize;
  before(done => {
    storage.init({config: config.db});
    storage.loadModels(metamodels);
    storage.loadModels(sttmodels);
    const prepareserver = require('app/server/prepareserver.js');
    const testmeta = require('../../../utils/testmeta.js');
    models = storage.models;
    Sequelize = storage.Sequelize;
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => prepareserver())
    .then(() => testmeta.load())
    .then(() => done());
  });

  describe('persist data', () => {

    const s1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1',
      stId: 'stt1',
      labId: null,
      origin: 'ABC',
      outstanding: true
    };

    it('should save single sample ids', () =>
      expect(
        models.SampleIds.create(s1)
        .then(dbresult.plain)
        .then(dbresult.omitDateDBCols)
      ).to.eventually.deep.equal(s1)
    );

    it('should not save duplicate sample ids', () =>
      expect(
        models.SampleIds.create(s1)
      ).to.eventually.be.rejectedWith(Sequelize.UniqueConstraintError)
    );

    const s2 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
      stId: 'stt2',
      labId: 'LAB0000002',
      origin: 'ABC',
      outstanding: true
    };

    const a1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
      artifactType: 'BLOOD'
    };
    const a2 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx4',
      artifactType: 'FORM'
    };

    const expectedA1 = [
      Object.assign({}, a1, {sampleId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'}),
      Object.assign({}, a2, {sampleId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'})
    ];

    it('should save artifacts included with new sample ids', () =>
      expect(
        models.SampleIds.create(
          Object.assign({}, s2, {Artifacts: [a1, a2]}),
          {include: [models.Artifacts]}
        )
        .then(result => result.Artifacts)
        .map(dbresult.plain)
        .map(dbresult.omitDateDBCols)
      ).to.eventually.deep.equal(expectedA1)
    );

    const s3 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5',
      stId: 'stt3',
      labId: 'LAB0000003',
      origin: 'ABC',
      outstanding: true
    };

    const test1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx6',
      testType: 'TESTA'
    };
    const test2 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx7',
      testType: 'TESTB'
    };

    const expectedTest1 = [
      Object.assign({}, test1,
                    {sampleId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5'}),
      Object.assign({}, test2,
                    {sampleId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5'})
    ];

    it('should save lab tests included with new sample ids', () =>
      expect(
        models.SampleIds.create(
          Object.assign({}, s3, {LabTests: [test1, test2]}),
          {include: models.LabTests}
        )
        .then(result => result.LabTests)
        .map(dbresult.plain)
        .map(dbresult.omitDateDBCols)
      ).to.eventually.deep.equal(expectedTest1)
    );

    const a3 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx8',
      artifactType: 'BLOOD'
    };

    const expectedA3 = [Object.assign({}, a3, {sampleId: s1.uuid})];

    it('should add artifacts for an existing sample id', () =>
      expect(
        models.SampleIds.findOne({where: {stId: s1.stId}})
        .then(sampleIds => BPromise.join(
            sampleIds,
            models.Artifacts.create(Object.assign({}, a3, {
              sampleId: sampleIds.uuid
            }))
          )
        )
        .spread(sampleIds => sampleIds.getArtifacts())
        .map(dbresult.plain)
        .map(dbresult.omitDateDBCols)
      ).to.eventually.deep.equal(expectedA3)
    );

    it('should save metadata');
    it('should save single changes');

  });

});
