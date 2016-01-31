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
  const initialMetadata = [
    {
      type: 'artifact',
      key: 'blood',
      value: 'Blood vial',
      valueType: 'string'
    }, {
      type: 'artifact',
      key: 'dbs',
      value: 'Dried blood spot',
      valueType: 'string'
    }, {
      type: 'person',
      key: 'PER1',
      value: 'Some Person 1',
      valueType: 'string'
    }, {
      type: 'person',
      key: 'PER2',
      value: 'Some Person 2',
      valueType: 'string'
    }, {
      type: 'facility',
      key: 'ABC',
      value: 'Duis autem vel eum',
      valueType: 'string'
    }, {
      type: 'facility',
      key: 'DEF',
      value: 'Ut wisi enim ad minim veniam',
      valueType: 'string'
    }, {
      type: 'facility',
      key: 'GHI',
      value: 'Ut wisi enim ad minim veniam',
      valueType: 'string'
    }, {
      type: 'region',
      key: 'BR',
      value: 'Berea',
      valueType: 'string'
    }, {
      type: 'region',
      key: 'BB',
      value: 'Butha-Buthe',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTA',
      value: 'A test of type A',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTB',
      value: 'A type B test',
      valueType: 'string'
    }, {
      type: 'labtest',
      key: 'TESTC',
      value: 'A test of type C',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'SOBAD',
      value: 'This thing was really bad',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'OHNOE',
      value: 'Something melted',
      valueType: 'string'
    }, {
      type: 'rejection',
      key: 'SMELL',
      value: 'Smells odd',
      valueType: 'string'
    }
  ];

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.Metadata.bulkCreate(initialMetadata))
    .then(() => done());
  });

  const expectedFacilities = [
    {
      key: 'ABC',
      value: 'Duis autem vel eum'
    }, {
      key: 'DEF',
      value: 'Ut wisi enim ad minim veniam'
    }, {
      key: 'GHI',
      value: 'Ut wisi enim ad minim veniam'
    }
  ];

  it('should get facilities', done => {
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

  const facilityKey = expectedFacilities[0].key;

  it('should get single facilities', done => {
    request(app)
    .get('/stt/meta/facilities/' + facilityKey)
    .expect(200)
    .toPromise()
    .then(res => res.body)
    .then(dbresult.omitDBCols)
    .tap(body => expect(body).to.deep.equal(expectedFacilities[0]))
    .then(() => done())
    .catch(err => done(err));
  });

});
