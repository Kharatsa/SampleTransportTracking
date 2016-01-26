'use strict';

const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const express = require('express');
// const BPromise = require('bluebird');

const config = require('app/config');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
storage.init({config: config.db});
storage.loadModels(sttmodels);
const AggregateRoutes = require('app/server/odk/aggregateroutes.js');

const app = express();
app.use('/odk', AggregateRoutes);

describe('Disa Labs Lab Status Update API', () => {
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
      labId: null,
      outstanding: true
    }
  ];

  before(done => {
    return storage.db.dropAllSchemas()
    .then(() => storage.db.sync())
    .then(() => storage.models.SampleIds.bulkCreate(initialSampleIds))
    .then(() => done());
  });

  const sdepart1 = (
    '<?xml version=\'1.0\' ?>' +
    '<sdepart id="sdepart" version="3">' +
      '<start>2016-01-22T22:15:40.838-05</start>' +
      '<end>2016-01-22T22:17:49.495-05</end>' +
      '<deviceid>867979020085780</deviceid>' +
      '<simserial>8901260971103975692</simserial>' +
      '<person>md563</person>' +
      '<region>MSR</region>' +
      '<facility>SPR</facility>' +
      '<srepeat>' +
        '<stid>9781933988696</stid>' +
        '<stype>form</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>1c92a4637</stid>' +
        '<stype>blood</stype>' +
        '<condition>soiled</condition>' +
      '</srepeat>' +
      '<srepeat>' +
        '<stid>9781933988696</stid>' +
        '<stype>dbs</stype>' +
        '<condition>ok</condition>' +
      '</srepeat>' +
      '<store_gps>40.76310203 -73.9617425 171.0 23.0</store_gps>' +
      '<meta>' +
        '<instanceID>uuid:dbd663ba-10ed-4b36-bbc1-f61557477646</instanceID>' +
      '</meta>' +
    '</sdepart>'
  );

  const expectedResponse = 'Submission successful';

  it('should accept new odk collect sdepart submissions', done => {
    request(app)
    .post('/odk/submission')
    .type('form')
    .send({'xml_submission_file': sdepart1})
    .expect(201)
    .end((err, res) => {
      if (err) {
        expect(err).to.be.undefined;
      }
      expect(res.text).to.equal(expectedResponse);
      done();
    });
  });

});
