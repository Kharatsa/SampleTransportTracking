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
  const metadata = require('../../data/metadata.test.json');

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.Metadata.bulkCreate(metadata))
    .then(() => done());
  });

  const expectedFacilities = [
    {
      type: 'facility',
      key: 'ABC',
      value: 'Duis autem vel eum'
    }, {
      type: 'facility',
      key: 'DEF',
      value: 'Ut wisi enim ad minim veniam'
    }, {
      type: 'facility',
      key: 'GHI',
      value: 'Ut wisi enim ad minim veniam'
    }
  ];

  it('should get all facilities', done => {
    request(app)
    .get('/stt/meta/facilities')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedFacilities))
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

  const expectedRegions = [
    {
      type: 'region',
      key: 'BB',
      value: 'Butha-Buthe'
    }, {
      type: 'region',
      key: 'BR',
      value: 'Berea'
    }
  ];

  it('should get all regions', done => {
    request(app)
    .get('/stt/meta/regions')
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .map(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedRegions))
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

  it('should get all statuses');
  it('should get single statuses');

  it('should get all artifacts');
  it('should get single artifacts');

  it('should get all people');
  it('should get single people');

  it('should get all lab tests');
  it('should get single lab tests');

  it('should get all lab rejections');
  it('should get single lab rejections');

});
