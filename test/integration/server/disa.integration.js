'use strict';

const path = require('path');
const fs = require('fs');
const BPromise = require('bluebird');
const request = require('supertest-as-promised')(BPromise.Promise);
const chai = require('chai');
const expect = chai.expect;

const express = require('express');
const config = require('app/config');
const metamodels = require('app/server/stt/models/metadata');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
storage.init({config: config.db});
storage.loadModels(metamodels);
storage.loadModels(sttmodels);
const prepareserver = require('app/server/prepareserver.js');
const DisaRoutes = require('app/server/disa/disaroutes.js');

const app = express();
app.use('/disa', DisaRoutes);

describe('Disa Labs Lab Status Update API', () => {
  // const sampleIds = require('../../data/sampleids.test.json');

  const manyUpdates = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-many.xml')}`
  );

  const manyUpdatesAmended = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-many-amended.xml')}`
  );

  const singleUpdate = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-single.xml')}`
  );

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => prepareserver())
    // .then(() => storage.models.SampleIds.bulkCreate(sampleIds))
    .then(() => done());
  });

  const expectedResponse = 'Submission successful';

  it('should accept new lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')

    .send(manyUpdates)
    // .expect(201)
    .toPromise()
    .then(res => expect(res.text).to.equal(expectedResponse))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should handle duplicate lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(manyUpdates)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should handle updated lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(manyUpdatesAmended)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should handle a lab status submission with one update', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(singleUpdate)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

});
