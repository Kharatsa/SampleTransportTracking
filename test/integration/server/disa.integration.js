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
const DisaRoutes = require('app/server/disa/disaroutes.js');

const app = express();
app.use('/disa', DisaRoutes);

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

  const manyUpdates = (
    '<?xml version="1.0"?>' +
    '<LabStatus xmlns="http://kharatsa.com/schemas/labstatus.xsd" >' +
      '<STID>ABCD12345</STID>' +
      '<LabID>MHL1234567</LabID>' +
      '<StatusTimestamp>2015-01-01T00:00:00</StatusTimestamp>' +
      '<LabPrefix>' +
        '<LabPrefixCode>MHL</LabPrefixCode>' +
        '<Description>Duis autem vel</Description>' +
      '</LabPrefix>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>RVW</StatusCode>' +
          '<Description>Fusce vulputate faucibus lectus, et lacinia urna' +
          '</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTB</TestCode>' +
          '<Description>Ut wisi enim ad minim veniam' +
          '</Description>' +
        '</Test>' +
      '</SampleTest>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>REJ</StatusCode>' +
          '<Description>Cras nec tristique enim</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTC</TestCode>' +
          '<Description>Just another test</Description>' +
        '</Test>' +
        '<Rejection>' +
          '<RejectionCode>SOBAD</RejectionCode>' +
          '<Description>Morbi elementum erat quis pretium sodales' +
          '</Description>' +
        '</Rejection>' +
      '</SampleTest>' +
    '</LabStatus>'
  );

  const expectedResponse = 'Submission successful';

  it('should accept new lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .expect(201)
    .send(manyUpdates)
    .end((err, res) => {
      if (err) {
        expect(err).to.be.undefined;
      }
      expect(res.text).to.equal(expectedResponse);
      done();
    });
  });

  it('should handle duplicate lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .expect(201)
    .send(manyUpdates)
    .end((err, res) => {
      if (err) {
        expect(err).to.be.undefined;
      }
      expect(res.text).to.equal(expectedResponse);
      done();
    });
  });

  const manyUpdatesAmended = (
    '<?xml version="1.0"?>' +
    '<LabStatus xmlns="http://kharatsa.com/schemas/labstatus.xsd" >' +
      '<STID>ABCD12345</STID>' +
      '<LabID>ABC1234567</LabID>' +
      '<StatusTimestamp>2015-01-01T00:00:00</StatusTimestamp>' +
      '<LabPrefix>' +
        '<LabPrefixCode>ABC</LabPrefixCode>' +
        '<Description>A different location</Description>' +
      '</LabPrefix>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>RVW</StatusCode>' +
          '<Description>Fusce vulputate faucibus lectus, et lacinia urna' +
          '</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTB</TestCode>' +
          '<Description>Ut wisi enim ad minim veniam' +
          '</Description>' +
        '</Test>' +
      '</SampleTest>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>REJ</StatusCode>' +
          '<Description>Changes rejected description</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>TESTC</TestCode>' +
          '<Description>This one also changed</Description>' +
        '</Test>' +
        '<Rejection>' +
          '<RejectionCode>SOBAD</RejectionCode>' +
          '<Description>Morbi elementum erat quis pretium sodales' +
          '</Description>' +
        '</Rejection>' +
      '</SampleTest>' +
    '</LabStatus>'
  );

  it('should handle updated lab status submissions', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .expect(201)
    .send(manyUpdatesAmended)
    .end((err, res) => {
      if (err) {
        expect(err).to.be.undefined;
      }
      expect(res.text).to.equal(expectedResponse);
      done();
    });
  });

  const singleUpdate = (
    '<?xml version="1.0"?>' +
    '<LabStatus xmlns="http://kharatsa.com/schemas/labstatus.xsd" >' +
      '<STID>ABCD12345</STID>' +
      '<LabID>ABC1234567</LabID>' +
      '<StatusTimestamp>2015-01-01T00:00:00</StatusTimestamp>' +
      '<LabPrefix>' +
        '<LabPrefixCode>ABC</LabPrefixCode>' +
        '<Description>Duis autem vel</Description>' +
      '</LabPrefix>' +
      '<SampleTest>' +
        '<Status>' +
          '<StatusCode>PRT</StatusCode>' +
          '<Description>Lorem ipsum dolor sit amet</Description>' +
        '</Status>' +
        '<Test>' +
          '<TestCode>*</TestCode>' +
          '<Description></Description>' +
        '</Test>' +
      '</SampleTest>' +
    '</LabStatus>'
  );

  it('should handle a lab status submission with one update', done => {
    request(app)
    .post('/disa/status')
    .type('application/xml')
    .expect(201)
    .send(singleUpdate)
    .end((err, res) => {
      if (err) {
        expect(err).to.be.undefined;
      }
      expect(res.text).to.equal(expectedResponse);
      done();
    });
  });

});
