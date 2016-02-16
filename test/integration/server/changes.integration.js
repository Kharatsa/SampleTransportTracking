'use strict';

const BPromise = require('bluebird');
const request = require('supertest-as-promised')(BPromise.Promise);
const chai = require('chai');
const expect = chai.expect;

const express = require('express');
const config = require('app/config');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
storage.init({config: config.db});
storage.loadModels(sttmodels);
const STTRoutes = require('app/server/stt/sttroutes.js');
const dbresult = require('app/server/storage/dbresult.js');

const app = express();
app.use('/stt', STTRoutes);

describe('STT Changes API', () => {
  const sampleIds = require('../../data/sampleids.test.json');
  const metadata = require('../../data/metadata.test.json');
  const artifacts = require('../../data/artifacts.test.json');
  const labTests = require('../../data/labtests.test.json');
  const changes = require('../../data/changes.test.json');

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.SampleIds.bulkCreate(sampleIds))
    .then(() => storage.models.Metadata.bulkCreate(metadata))
    .then(() => storage.models.Artifacts.bulkCreate(artifacts))
    .then(() => storage.models.LabTests.bulkCreate(labTests))
    .then(() => storage.models.Changes.bulkCreate(changes))
    .then(() => done());
  });

  const expectedChanges = [
    Object.assign({},
      changes[0],
      {Artifact: Object.assign({}, artifacts[0], {SampleId: sampleIds[0]})},
      {LabTest: null}
    ),
    Object.assign({},
      changes[1],
      {Artifact: Object.assign({}, artifacts[1], {SampleId: sampleIds[0]})},
      {LabTest: null}
    ),
    Object.assign({},
      changes[2],
      {Artifact: Object.assign({}, artifacts[2], {SampleId: sampleIds[0]})},
      {LabTest: null}
    ),
    Object.assign({},
      changes[3],
      {Artifact: Object.assign({}, artifacts[3], {SampleId: sampleIds[1]})},
      {LabTest: null}
    ),
    Object.assign({},
      changes[4],
      {Artifact: Object.assign({}, artifacts[4], {SampleId: sampleIds[1]})},
      {LabTest: null}
    ),
    Object.assign({},
      changes[5],
      {Artifact: null},
      {LabTest: Object.assign({}, labTests[0], {SampleId: sampleIds[2]})}
    ),
    Object.assign({},
      changes[6],
      {Artifact: null},
      {LabTest: Object.assign({}, labTests[1], {SampleId: sampleIds[2]})}
    ),
    Object.assign({},
      changes[7],
      {Artifact: null},
      {LabTest: Object.assign({}, labTests[2], {SampleId: sampleIds[2]})}
    )
  ];

  it('should get all changes', done => {
    request(app)
    .get('/stt/changes')
    .expect(200)
    .toPromise()
    .then(res => res.body.data)
    .map(change => {
      let include;
      let sampleId;
      let result = dbresult.omitDateDBCols(change);
      if (change.artifact !== null) {
        sampleId = dbresult.omitDateDBCols(change.Artifact.SampleId);
        include = dbresult.omitDateDBCols(change.Artifact);
        return Object.assign({},
          result,
          {Artifact: Object.assign({}, include, {SampleId: sampleId})}
        );
      } else {
        sampleId = dbresult.omitDateDBCols(change.LabTest.SampleId);
        include = dbresult.omitDateDBCols(change.LabTest);
        return Object.assign({},
          result,
          {LabTest: Object.assign({}, include, {SampleId: sampleId})}
        );
      }
    })
    .tap(body => expect(body).to.deep.equal(expectedChanges))
    .then(() => done())
    .catch(err => done(err));
  });

});
