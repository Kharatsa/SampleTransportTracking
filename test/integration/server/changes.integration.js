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

describe('', () => {
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
    // Object.assign({}, changes[0], {Artifact: },
  ];

  it.skip('should get all changes', done => {
    request(app)
    .get('/stt/changes')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDateDBCols)
    .tap(console.log)
    .tap(body => expect(body).to.deep.equal(changes))
    .then(() => done())
    .catch(err => done(err));
  });

});
