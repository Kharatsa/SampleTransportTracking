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

describe('STT Metadata API', () => {
  const initialSampleIds = [
    {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1',
      stId: 'stt1',
      labId: null,
      outstanding: true
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
      stId: 'stt2',
      labId: null,
      outstanding: true
    }, {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3',
      stId: 'stt3',
      labId: 'LAB0000001',
      outstanding: true
    }
  ];

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.SampleIds.bulkCreate(initialSampleIds))
    .then(() => done());
  });

  it('should get all sample ids', done => {
    request(app)
    .get('/stt/ids')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(initialSampleIds))
    .then(() => done())
    .catch(err => done(err));
  });

  const stId = initialSampleIds[0].stId;

  it('should single sample ids by stId', done => {
    request(app)
    .get('/stt/ids/' + stId)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(initialSampleIds[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const labId = initialSampleIds[2].labId;

  it('should single sample ids by lab id', done => {
    request(app)
    .get('/stt/ids/' + labId)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDateDBCols)
    .tap(body => expect(body).to.deep.equal(initialSampleIds[2]))
    .then(() => done())
    .catch(err => done(err));
  });

});
