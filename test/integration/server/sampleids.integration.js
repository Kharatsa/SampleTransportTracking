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

describe('STT Samples API', () => {
  const sampleIds = require('../../data/sampleids.test.json');

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.SampleIds.bulkCreate(sampleIds))
    .then(() => done());
  });

  // const expectedAllSamples = .map(
  //   result => Object.assign({}, result, {
  //     Artifacts: [],
  //     LabTests: []
  //   })
  // );

  it('should get all sample ids', done => {
    request(app)
    .get('/stt/ids')
    .expect(200)
    .toPromise()
    .then(res => res.body.data)
    .map(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(sampleIds))
    .then(() => done())
    .catch(err => done(err));
  });

  const stId = sampleIds[0].stId;

  const expecteSample1 = Object.assign({}, sampleIds[0], {
    Artifacts: [],
    LabTests: []
  });

  it('should single sample ids by stId', done => {
    request(app)
    .get(`/stt/ids/${stId}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(expecteSample1))
    .then(() => done())
    .catch(err => done(err));
  });

  const labId = sampleIds[2].labId;
  const expecteSample2 = Object.assign({}, sampleIds[2], {
    Artifacts: [],
    LabTests: []
  });

  it('should single sample ids by labId', done => {
    request(app)
    .get(`/stt/ids/${labId}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(expecteSample2))
    .then(() => done())
    .catch(err => done(err));
  });

});
