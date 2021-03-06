'use strict';

const path = require('path');
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
const testmeta = require('../../utils/testmeta.js');
const AggregateRoutes = require('server/odk/aggregateroutes.js');

const app = express();
app.use('/odk', AggregateRoutes);

describe('ODK Collect Submission API', function() {
  this.timeout(5000);

  const dataPath = path.join(__dirname, '..', '..', 'data');

  before(() => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => prepareserver())
    .then(() => testmeta.load())
    .catch(console.error);
  });

  const expectedResponse = 'Submission successful';

  it('should accept new odk collect sdepart submissions', () => {
    return request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sdepart1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should accept new odk collect sdepart submissions (2)', () => {
    return request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sdepart2.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should accept new odk collect sarrive submissions', () => {
    return request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sarrive1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should accept new odk collect rdepart submissions', () => {
    return request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'rdepart1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

  it('should accept new odk collect rarrive submissions', () => {
    return request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'rarrive1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201));
  });

});
