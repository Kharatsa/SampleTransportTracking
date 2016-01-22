'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const config = require('app/config');
const storage = require('app/server/storage');
const sttmodels = require('app/server/stt/models');
const datadb = require('app/server/util/datadb.js');

describe('Sample Transport Tracking Database', () => {
  var models;
  var Sequelize;
  before(done => {
    storage.init({config: config.db});
    storage.loadModels(sttmodels);
    models = storage.models;
    Sequelize = storage.Sequelize;
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => done());
  });

  describe('persist data', () => {
    const s1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1',
      stId: 'stt1',
      labId: null,
      outstanding: true
    };

    it('should save single sample ids', () =>
      expect(
        models.SampleIds.create(s1)
        .then(datadb.makePlain)
        .then(datadb.omitDBCols)
      ).to.eventually.deep.equal(s1)
    );

    it('should not save duplicate sample ids', () =>
      expect(
        models.SampleIds.create(s1)
      ).to.eventually.be.rejectedWith(Sequelize.UniqueConstraintError)
    );

    const meta1 = [
      {
        type: 'artifact',
        key: 'form',
        value: 'Form',
        valueType: 'string'
      },
      {
        type: 'artifact',
        key: 'blood',
        value: 'Blood',
        valueType: 'string'
      },
      {
        type: 'artifact',
        key: 'dbs',
        value: 'Dried Blood Spot',
        valueType: 'string'
      },
      {
        type: 'labtest',
        key: 'TESTA',
        value: 'Test A',
        valueType: 'string'
      },
      {
        type: 'labtest',
        key: 'TESTB',
        value: 'Some Test Named B',
        valueType: 'string'
      },
      {
        type: 'facility',
        key: 'FACILITY1',
        value: 'A great facility',
        valueType: 'string'
      },
      {
        type: 'person',
        key: 'PERSON1',
        value: 'A great person',
        valueType: 'string'
      },
      {
        type: 'status',
        key: 'OK',
        value: 'Everything is just great',
        valueType: 'string'
      }
    ];

    it('should save metadata', () =>
      expect(
        BPromise.map(meta1, meta => models.Metadata.create(meta))
        .map(datadb.makePlain)
        .map(datadb.omitDBCols)
      ).to.eventually.deep.equal(meta1)
    );

    const s2 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
      stId: 'stt2',
      labId: 'LAB0000002',
      outstanding: true
    };

    const a1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
      artifactType: 'blood'
    };
    const a2 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx4',
      artifactType: 'form'
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
        .map(datadb.makePlain)
        .map(datadb.omitDBCols)
      ).to.eventually.deep.equal(expectedA1)
    );

    const s3 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5',
      stId: 'stt3',
      labId: 'LAB0000003',
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
        .map(datadb.makePlain)
        .map(datadb.omitDBCols)
      ).to.eventually.deep.equal(expectedTest1)
    );

    const a3 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx8',
      artifactType: 'blood'
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
        .map(datadb.makePlain)
        .map(datadb.omitDBCols)
      ).to.eventually.deep.equal(expectedA3)
    );

    const c1 = {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx9',
      statusDate: new Date('2016-01-01T10:00:00.000Z'),
      stage: 'spickup',
      artifact: a3.uuid,
      facility: 'FACILITY1',
      person: 'PERSON1',
      status: 'OK'
    };

    const expectedC1 = Object.assign({}, c1, {
      labTest: null,
      labRejection: null
    });

    it('should save single changes', () =>
      expect(
        models.Changes.create(c1)
        .then(instance => instance.reload())
        .then(datadb.makePlain)
        .then(datadb.omitDBCols)
      ).to.eventually.deep.equal(expectedC1)
    );

  });

});
