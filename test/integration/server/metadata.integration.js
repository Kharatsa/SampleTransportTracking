'use strict';

const _ = require('lodash');
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
  const metadata = require('../../data/metadata.test.json');

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.Metadata.bulkCreate(metadata))
    .then(() => done());
  });

  const omitValueType = meta => _.omit(meta, ['valueType']);

  const expectedFacilities = metadata
    .filter(item => item.type === 'facility')
    .map(omitValueType);

  it('should get all facilities', done => {
    request(app)
    .get('/stt/meta/facilities')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.include.members(expectedFacilities))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single facilities', done => {
    request(app)
    .get(`/stt/meta/facilities/${expectedFacilities[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedFacilities[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedRegions = metadata
    .filter(item => item.type === 'region')
    .map(omitValueType);

  it('should get all regions', done => {
    request(app)
    .get('/stt/meta/regions')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.include.members(expectedRegions))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single regions', done => {
    request(app)
    .get(`/stt/meta/regions/${expectedRegions[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedRegions[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedStatus = metadata
    .filter(item => item.type === 'status')
    .map(omitValueType);

  it('should get all statuses', done => {
    request(app)
    .get('/stt/meta/status')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .then(body => expect(body).deep.include.members(expectedStatus))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single statuses', done => {
    request(app)
    .get(`/stt/meta/status/${expectedStatus[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedStatus[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedArtifacts = metadata
    .filter(item => item.type === 'artifact')
    .map(omitValueType);

  it('should get all artifacts', done => {
    request(app)
    .get('/stt/meta/artifacts')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .then(body => expect(body).deep.include.members(expectedArtifacts))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single artifacts', done => {
    request(app)
    .get(`/stt/meta/artifacts/${expectedArtifacts[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedArtifacts[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedPeople = metadata
    .filter(item => item.type === 'person')
    .map(omitValueType);

  it('should get all people', done => {
    request(app)
    .get('/stt/meta/people')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .then(body => expect(body).deep.include.members(expectedPeople))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single people', done => {
    request(app)
    .get(`/stt/meta/people/${expectedPeople[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedPeople[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedLabTests = metadata
    .filter(item => item.type === 'labtest')
    .map(omitValueType);

  it('should get all lab tests', done => {
    request(app)
    .get('/stt/meta/labtests')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .then(body => expect(body).deep.include.members(expectedLabTests))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single lab tests', done => {
    request(app)
    .get(`/stt/meta/labtests/${expectedLabTests[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedLabTests[0]))
    .then(() => done())
    .catch(err => done(err));
  });

  const expectedRejections = metadata
    .filter(item => item.type === 'rejection')
    .map(omitValueType);

  it('should get all lab rejections', done => {
    request(app)
    .get('/stt/meta/rejections')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .then(body => expect(body).deep.include.members(expectedRejections))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should get single lab rejections', done => {
    request(app)
    .get(`/stt/meta/rejections/${expectedRejections[0].key}`)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedRejections[0]))
    .then(() => done())
    .catch(err => done(err));
  });

});
