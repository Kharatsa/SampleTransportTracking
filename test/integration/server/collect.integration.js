'use strict';

const path = require('path');
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
const AggregateRoutes = require('app/server/odk/aggregateroutes.js');

const app = express();
app.use('/odk', AggregateRoutes);

describe('ODK Collect Submission API', () => {
  const sampleIds = require('../../data/sampleids.test.json');
  const metadata = require('../../data/metadata.test.json');
  const dataPath = path.join(__dirname, '..', '..', 'data');

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.SampleIds.bulkCreate(sampleIds))
    .then(() => storage.models.Metadata.bulkCreate(metadata))
    .catch(console.error)
    .then(() => done());
  });

  const expectedResponse = 'Submission successful';

  it('should accept new odk collect sdepart submissions', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sdepart1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should accept new odk collect sdepart submissions (2)', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sdepart2.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should accept new odk collect sarrive submissions', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'sarrive1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should accept new odk collect rdepart submissions', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'rdepart1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should accept new odk collect rarrive submissions', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .attach(
      'xml_submission_file',
      `${path.join(dataPath, 'rarrive1.xml')}`,
      'xml_submission_file.xml'
    )
    .toPromise()
    .tap(res => expect(res.text).to.equal(expectedResponse))
    .tap(res => expect(res.statusCode).to.equal(201))
    .then(() => done())
    .catch(err => done(err));
  });

});
