'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const publishtransform = require('app/server/odk/publisher/publishtransform');

describe('Published Data Transforms', () => {

  describe('sample arrival', () => {

    var published = {
      token: 'qwerty',
      content: 'record',
      formId: 'sarrive',
      formVersion: '',
      data: [{
        '*meta-instance-id*': 'uuid:abcdef',
        '*meta-model-version*': null,
        '*meta-ui-version*': null,
        '*meta-submission-date*': '2015-11-15T17:54:51.000Z',
        '*meta-is-complete*': true,
        '*meta-date-marked-as-complete*': '2015-11-15T17:54:51.000Z',
        start: '2015-11-15T17:53:37.000Z',
        end: '2015-11-15T17:54:58.000Z',
        deviceid: '1234',
        simserial: '5678',
        person: 'person1',
        region: 'mafeteng',
        facility: 'mttabor',
        srepeat: [{
          stid: 'st1',
          stype: 'blood',
          condition: 'ok'
        }, {
          stid: 'st1',
          stype: 'other',
          condition: 'ok'
        }, {
          stid: 'st1',
          stype: 'blood',
          condition: 'ok'
        }, {
          stid: 'st2',
          stype: 'blood',
          condition: 'ok'
        }, {
          stid: 'st3',
          stype: 'blood',
          condition: 'ok'
        }, {
          stid: 'st4',
          stype: 'sputum',
          condition: 'broken'
        }],
        'store_gps:Latitude': 40.7637205,
        'store_gps:Longitude': -73.9613878,
        'store_gps:Altitude': 0,
        'store_gps:Accuracy': 20,
        instanceID: 'uuid:abcdef'
      }]
    };

    var transformed = [{
      samples: [{
        stId: 'st1',
        labId: null,
        type: 'blood'
      }, {
        stId: 'st2',
        labId: null,
        type: 'blood'
      }, {
        stId: 'st3',
        labId: null,
        type: 'blood'
      }, {
        stId: 'st4',
        labId: null,
        type: 'sputum'
      }],
      submission: {
        form: 'sarrive',
        submissionId: 'uuid:abcdef',
        facility: 'mttabor',
        person: 'person1',
        deviceId: '1234',
        simSerial: '5678',
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
        submissionId: 'uuid:abcdef',
        submissionNumber: 1,
        stId: 'st1',
        labId: null,
        sampleUpdatesCount: 3,
        sampleStatus: 'ok'
      }, {
        submissionId: 'uuid:abcdef',
        submissionNumber: 2,
        stId: 'st2',
        labId: null,
        sampleUpdatesCount: 1,
        sampleStatus: 'ok'
      }, {
        submissionId: 'uuid:abcdef',
        submissionNumber: 3,
        stId: 'st3',
        labId: null,
        sampleUpdatesCount: 1,
        sampleStatus: 'ok'
      }, {
        submissionId: 'uuid:abcdef',
        submissionNumber: 4,
        stId: 'st4',
        labId: null,
        sampleUpdatesCount: 1,
        sampleStatus: 'broken'
      }],
      tests: []
    }];

    var expectedData = transformed[0];

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

    it('should be a array with length 1', () =>
      expect(parsed.length).to.equal(1)
    );

    it('should have parsed samples', () =>
      expect(data.samples).to.deep.equal(expectedData.samples)
    );

    it('should have parsed a facility', () =>
      expect(data.facility).to.deep.equal(expectedData.facility)
    );

    it('should have parsed a person', () =>
      expect(data.person).to.deep.equal(expectedData.person)
    );

    it('should have parsed a submission', () =>
      expect(data.submission).to.deep.equal(expectedData.submission)
    );

    it('should have parsed updates', () =>
      expect(data.updates).to.deep.equal(expectedData.updates)
    );

    it('should have parsed test requests', () =>
      expect(data.tests).to.deep.equal(expectedData.tests)
    );

  });

  describe('lab status', () => {

    var published = {
      token: 'qwerty',
      content: 'record',
      formId: 'labstatus',
      formVersion: '',
      data: [{
        '*meta-instance-id*': 'uuid:abcdef',
        '*meta-model-version*': null,
        '*meta-ui-version*': null,
        '*meta-submission-date*': '2015-11-15T17:54:51.000Z',
        '*meta-is-complete*': true,
        '*meta-date-marked-as-complete*': '2015-11-15T17:54:51.000Z',
        start: '2015-11-15T17:53:37.000Z',
        end: '2015-11-15T17:54:58.000Z',
        deviceid: null,
        simserial: null,
        person: null,
        region: null,
        facility: null,
        srepeat: [{
          stid: 'st1',
          labid: 'lab1',
          labstatus: 'REQ',
          labtest: 'TEST1',
          labreject: null
        }, {
          stid: 'st1',
          labid: 'lab1',
          labstatus: 'RVW',
          labtest: 'TEST2',
          labreject: null
        }, {
          stid: 'st1',
          labid: 'lab1',
          labstatus: 'REJ',
          labtest: 'TEST3',
          labreject: 'BAD'
        }],
        'store_gps:Latitude': null,
        'store_gps:Longitude': null,
        'store_gps:Altitude': null,
        'store_gps:Accuracy': null,
        instanceID: 'uuid:abcdef'
      }]
    };

    var transformed = [{
      samples: [{
        stId: 'st1',
        labId: 'lab1',
        type: null
      }],
      submission: {
        form: 'labstatus',
        submissionId: 'uuid:abcdef',
        facility: null,
        person: null,
        deviceId: null,
        simSerial: null,
        formStartDate: new Date('2015-11-15T17:53:37.000Z'),
        formEndDate: new Date('2015-11-15T17:54:58.000Z'),
        completedDate: new Date('2015-11-15T17:54:51.000Z')
      },
      facility: null,
      person: null,
      updates: [{
        submissionId: 'uuid:abcdef',
        submissionNumber: 1,
        stId: 'st1',
        labId: 'lab1',
        sampleUpdatesCount: 3,
        sampleStatus: null
      }],
      tests: [
        {
          submissionId: 'uuid:abcdef',
          stId: 'st1',
          labId: 'lab1',
          statusCode: 'REQ',
          testCode: 'TEST1',
          rejectCode: null
        },
        {
          submissionId: 'uuid:abcdef',
          stId: 'st1',
          labId: 'lab1',
          statusCode: 'RVW',
          testCode: 'TEST2',
          rejectCode: null
        },
        {
          submissionId: 'uuid:abcdef',
          stId: 'st1',
          labId: 'lab1',
          statusCode: 'REJ',
          testCode: 'TEST3',
          rejectCode: 'BAD'
        }
      ]
    }];

    var expectedData = transformed[0];

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

    it('should be a array with length 1', () =>
      expect(parsed.length).to.equal(1)
    );

    it('should have parsed samples', () =>
      expect(data.samples).to.deep.equal(expectedData.samples)
    );

    it('should have parsed a facility', () =>
      expect(data.facility).to.deep.equal(expectedData.facility)
    );

    it('should have parsed a person', () =>
      expect(data.person).to.deep.equal(expectedData.person)
    );

    it('should have parsed a submission', () =>
      expect(data.submission).to.deep.equal(expectedData.submission)
    );

    it('should have parsed updates', () =>
      expect(data.updates).to.deep.equal(expectedData.updates)
    );

    it('should have parsed test requests', () =>
      expect(data.tests).to.deep.equal(expectedData.tests)
    );

  });

});
