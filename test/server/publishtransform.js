'use strict';

const chai = require('chai');
const expect = chai.expect;
const publishtransform = require('app/server/odk/publisher/publishtransform');

var published =   {
  token: 'qwerty',
  content: 'record',
  formId: 'sarrive',
  formVersion: '',
  data: [{
    '*meta-instance-id*': 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    '*meta-model-version*': null,
    '*meta-ui-version*': null,
    '*meta-submission-date*': '2015-11-15T17:54:51.000Z',
    '*meta-is-complete*': true,
    '*meta-date-marked-as-complete*': '2015-11-15T17:54:51.000Z',
    start: '2015-11-15T17:53:37.000Z',
    end: '2015-11-15T17:54:58.000Z',
    deviceid: '867979020085780',
    simserial: '8901260971103975692',
    person: 'person1',
    region: 'mafeteng',
    facility: 'mttabor',
    srepeat: [{
      stid: '6e53a9d8e',
      stype: 'blood',
      condition: 'ok'
    }, {
      stid: '6e53a9d8e',
      stype: 'other',
      condition: 'ok'
    }, {
      stid: '6e53a9d8e',
      stype: 'blood',
      condition: 'ok'
    }, {
      stid: '712db1549',
      stype: 'blood',
      condition: 'ok'
    }, {
      stid: '2a4995409',
      stype: 'blood',
      condition: 'ok'
    }, {
      stid: '0e8786fdd',
      stype: 'sputum',
      condition: 'broken'
    }],
    'store_gps:Latitude': 40.7637205,
    'store_gps:Longitude': -73.9613878,
    'store_gps:Altitude': 0,
    'store_gps:Accuracy': 20,
    instanceID: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf'
  }]
};

var transformed = [{
  samples: [{
    stId: '6e53a9d8e',
    labId: null,
    type: 'blood'
  }, {
    stId: '6e53a9d8e',
    labId: null,
    type: 'other'
  }, {
    stId: '6e53a9d8e',
    labId: null,
    type: 'blood'
  }, {
    stId: '712db1549',
    labId: null,
    type: 'blood'
  }, {
    stId: '2a4995409',
    labId: null,
    type: 'blood'
  }, {
    stId: '0e8786fdd',
    labId: null,
    type: 'sputum'
  }],
  submission: {
    form: 'sarrive',
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    facility: 'mttabor',
    person: 'person1',
    deviceId: '867979020085780',
    simSerial: '8901260971103975692',
    formStartDate: new Date('2015-11-15T17:53:37.000Z'),
    formEndDate: new Date('2015-11-15T17:54:58.000Z'),
    completedDate: new Date('2015-11-15T17:54:51.000Z')
  },
  facility: {
    name: 'mttabor',
    region: 'mafeteng',
    type: null
  },
  person: {
    name: 'person1'
  },
  updates: [{
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 1,
    stId: '6e53a9d8e',
    labId: null,
    sampleStatus: 'ok'
  }, {
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 2,
    stId: '6e53a9d8e',
    labId: null,
    sampleStatus: 'ok'
  }, {
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 3,
    stId: '6e53a9d8e',
    labId: null,
    sampleStatus: 'ok'
  }, {
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 4,
    stId: '712db1549',
    labId: null,
    sampleStatus: 'ok'
  }, {
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 5,
    stId: '2a4995409',
    labId: null,
    sampleStatus: 'ok'
  }, {
    submissionId: 'uuid:a3e316dc-e5a0-48d3-b152-f4860874cabf',
    submissionNumber: 6,
    stId: '0e8786fdd',
    labId: null,
    sampleStatus: 'broken'
  }]
}];
var transformedData = transformed[0];

describe('Published Data Transforms', () => {

  describe('transformed parts', () => {
    var parsed;
    var data;
    before(done => {
      return publishtransform(published)
      .then(result => {
        parsed = result;
        data = parsed[0];
        done();
      });
    });

    it('should be a array with length 1', () => {
      expect(parsed.length).to.equal(1);
    });

    it('should have parsed 6 samples', () => {
      expect(data.samples).to.deep.equal(transformedData.samples);
    });

    it('should have parsed a facility', () => {
      expect(data.facility).to.deep.equal(transformedData.facility);
    });

    it('should have parsed a person', () => {
      expect(data.person).to.deep.equal(transformedData.person);
    });

    it('should have parsed a submission', () => {
      expect(data.submission).to.deep.equal(transformedData.submission);
    });

    it('should have parsed 6 updates', () => {
      expect(data.updates).to.deep.equal(transformedData.updates);
    });

  });

});
