'use strict';

const path = require('path');
const fs = require('fs');
const BPromise = require('bluebird');
const request = require('supertest-as-promised')(BPromise.Promise);
const chai = require('chai');
const expect = chai.expect;

const express = require('express');
const config = require('config');
const metamodels = require('server/stt/models/metadata');
const sttmodels = require('server/stt/models');
const storage = require('server/storage');
storage.init({config: config.db});
storage.loadModels(metamodels);
storage.loadModels(sttmodels);
const prepareserver = require('server/prepareserver.js');
const DisaRoutes = require('server/disa/disaroutes.js');

const app = express();
app.use('/disa', DisaRoutes);

describe('Disa Labs Lab Status Update API', function() {
  this.timeout(5000);

  const manyUpdates = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-many.xml')}`
  );

  const manyUpdatesAmended = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-many-amended.xml')}`
  );

  const singleUpdate = fs.readFileSync(
    `${path.join(__dirname, '..', '..', 'data', 'disa-single.xml')}`
  );

  before(() => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => prepareserver())
    .catch(console.error);
  });

  const expectedResponse = 'Submission successful';

  it('should accept new lab status submissions', () => {
    return request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(manyUpdates)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should handle duplicate lab status submissions', () => {
    return request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(manyUpdates)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should handle updated lab status submissions', () => {
    return request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(manyUpdatesAmended)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should handle a lab status submission with one update', () => {
    return request(app)
    .post('/disa/status')
    .type('application/xml')
    .send(singleUpdate)
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

});
