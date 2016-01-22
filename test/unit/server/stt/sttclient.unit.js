'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const BPromise = require('bluebird');
const _ = require('lodash');
const config = require('app/config');
const storage = require('app/server/storage');
const sttModels = require('app/server/stt/models');
const sttclient = require('app/server/stt/sttclient.js');
const datadb = require('app/server/util/datadb.js');

describe.skip('Sample Transport Tracking Client', () => {
  var client;

  before(done => {
    storage.init({config: config.db});
    Object.keys(sttModels).forEach(modelName =>
      storage.loadModel(sttModels[modelName])
    );

    client = sttclient.create({db: storage.db, models: storage.models});

    return storage.db.sync().then(() => done());
  });

  describe('empty database, empty parameter queries', () => {

    it('should fetch an empty people array', () => {
      return expect(client.getPeople())
        .to.eventually.be.empty;
      // .then(result => {
      //   expect(result).to.be.empty;
      //   done();
      // });
    });

    it('should fetch an empty facilities array', () => {
      return expect(client.getFacilities())
        .to.eventually.be.empty;
      // .then(result => {
      //   expect(result).to.be.empty;
      //   done();
      // });
    });

  });

  const goodSamples = [
    {stId: 'st1', labId: null, type: 'blood'},
    {stId: 'st2', labId: null, type: 'sputum'},
    {stId: 'st3', labId: null, type: null},
    {stId: 'st4', labId: 'lab1', type: 'dbs'},
    {stId: 'st5', labId: 'lab2', type: 'urine'}
  ];

  describe('sample entity methods', () => {

    it('should save new samples', () => {
      return expect(client.db.transaction(
        tran => client.saveSamples(goodSamples, tran)
      )).to.eventually.have.length(5);
      // client.db.transaction(tran => {
      //   return client.saveSamples(goodSamples, tran)
      //   .then(results => {
      //     expect(results).to.have.length(5);
      //     done();
      //   });
      // });
    });

    it('should retrieve individual samples by stId', done => {
      BPromise.map(goodSamples, sample =>
        BPromise.props({
          result: client.getSample({stId: sample.stId}),
          sample
        })
      )
      .each(item => {
        expect(item.sample).to.deep.equal(datadb.omitDBCols(item.result));
      }).then(() => done());
    });

    const hasLabId = sample => (
      sample.labId !== null && typeof sample.labId !== 'undefined'
    );

    it('should retrieve individual samples by labId', done => {
      BPromise.filter(goodSamples, hasLabId)
      .map(sample =>
        BPromise.props({
          result: client.getSample({labId: sample.labId}),
          sample
        })
      )
      .each(item =>
        expect(item.sample).to.deep.equal(datadb.omitDBCols(item.result))
      ).then(() => done());
    });

    it('should retrieve individual samples by anyId', done => {
      BPromise.map(goodSamples, sample => ({sample, anyId: sample.stId}))
      .then(stSamples =>
        BPromise.filter(goodSamples, hasLabId)
        .map(sample => ({sample, anyId: sample.labId}))
        .then(labSamples => stSamples.concat(labSamples))
      )
      .map(item =>
        BPromise.props({
          result: client.getSample({anyId: item.anyId}),
          sample: item.sample
        })
      )
      .each(item =>
        expect(item.sample).to.deep.equal(datadb.omitDBCols(item.result))
      ).then(() => done());
    });

    it('should update samples with ids', done => {
      var updateSample;
      client.getSample({stId: goodSamples[0].stId})
      .then(sample => {
        updateSample = datadb.omitDateDBCols(sample);
        updateSample.type = 'blood';
        return client.updateSamples({samples: [updateSample]})
        .then(counts => {
          var affectedCount = counts[0];
          expect(affectedCount).to.be.above(0,
            'update samples should return affectedCount > 0');
        })
        .then(() => client.getSample({stId: updateSample.stId}))
        .then(sample =>
          expect(datadb.omitDateDBCols(sample))
          .to.deep.equal(datadb.omitDateDBCols(updateSample),
            'sample record was not updated')
        )
        .then(() => done());
      });
    });

  });

  const goodForms = [
    {
      formId: 'form1',
      formName: 'Form One',
      majorMinorVersion: 1,
      version: 1,
      hash: 'abc',
      downloadUrl: 'http://www.form.com/form1.xml',
      manifestUrl: 'http://www.form.com/xformsManifest?formId=form1'
    },
    {
      formId: 'form2',
      formName: 'The Second Form',
      majorMinorVersion: 5,
      version: 55,
      hash: 'def',
      downloadUrl: 'http://www.form.com/form1.xml',
      manifestUrl: 'http://www.form.com/xformsManifest?formId=form1'
    },
    {
      formId: 'form3',
      formName: null,
      majorMinorVersion: null,
      version: null,
      hash: null,
      downloadUrl: null,
      manifestUrl: null
    }
  ];

  describe('form entity methods', () => {

    it('should save new forms', done => {
      client.saveForms(goodForms)
      .then(results => expect(results).to.have.length(goodForms.length))
      .then(() => done());
    });

    it('should throw a validation error for duplicate formIds', done => {
      return client.saveForms([goodForms[0]])
      .then(results => expect(results).to.be.undefined)
      .catch(err =>
        expect(err).to.be.instanceof(storage.Sequelize.UniqueConstraintError,
          'duplicate formIds should throw a violate the unique contraint')
      )
      .then(() => done());
    });

    var matchFormPair = form => {
      var match = _.find(goodForms, good => good.formId === form.formId);
      return {form, match};
    };

    it('should retrieve all forms', done => {
      return client.getForms()
      .map(matchFormPair)
      .each(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(datadb.omitDBCols(pair.form));
      }).then(() => done());
    });

    it('should retrieve forms by formIds', done => {
      var formIds = [goodForms[0].formId, goodForms[1].formId];
      return client.getForms({formIds})
      .tap(results => expect(results).to.be.length(formIds.length))
      .map(matchFormPair)
      .each(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(datadb.omitDBCols(pair.form));
      }).then(() => done());
    });

    it('should retrieve an individual form by formId', done => {
      var targetForm = goodForms[0];
      return client.getForm({formId: targetForm.formId})
      .then(form =>
        expect(datadb.omitDBCols(form)).to.deep.equal(targetForm)
      ).then(() => done());
    });

    it('should update forms with ids');

  });

  const goodFacilities = [
    {name: 'fac1', region: 'region1', type: null},
    {name: 'fac2', region: 'region1', type: null},
    {name: 'fac3', region: 'region2', type: null}
  ];
  describe('facilities entity methods', () => {

    var matchFacilityPair = facility => {
      var match = _.find(goodFacilities, good => good.name === facility.name);
      return {facility, match};
    };

    it('should save new facilities', done => {
      return client.saveFacilities(goodFacilities)
      .then(results => expect(results).to.have.length(goodFacilities.length))
      .then(() => done());
    });

    it('should retrieve all facilities', done => {
      client.getFacilities()
      .tap(facilities =>
        expect(facilities).to.be.length(goodFacilities.length)
      )
      .map(matchFacilityPair)
      .each(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(datadb.omitDBCols(pair.facility));
      })
      .then(() => done());
    });

    it('should retrieve facilities by facilityKeys');

    it('should retrieve an individual facility by facilityKey');

    it('should update facilities with ids');

  });

  const goodPeople = [
    {name: 'person1', type: 'rider'},
    {name: 'person2', type: 'lab'},
    {name: 'person3', type: null}
  ];

  describe('people entity methods', () => {

    var matchPeoplePair = person => {
      var match = _.find(goodPeople, good => good.name === person.name);
      return {person, match};
    };

    it('should save new people', done => {
      return client.savePeople(goodPeople)
      .then(results => expect(results).to.have.length(goodPeople.length))
      .then(() => done());
    });

    it('should retrieve all people', done => {
      return client.getPeople()
      .tap(people => expect(people).to.be.length(goodPeople.length))
      .map(matchPeoplePair)
      .each(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(datadb.omitDBCols(pair.person));
      }).then(() => done());
    });

    it('should retrieve people by peopleKeys');
    it('should retrieve an individual person by personKey');
    it('should update people with ids');
  });

  const goodSubmissions = [
    {
      form: goodForms[0].formId,
      submissionId: 'sub1',
      facility: goodFacilities[0].name,
      person: goodPeople[0].name,
      deviceId: 'dev1',
      simSerial: 'sim1',
      formStartDate: new Date(2015, 1, 1, 0, 0, 0, 0),
      formEndDate: new Date(2015, 1, 1, 0, 0, 10, 0),
      completedDate: new Date(2015, 1, 1, 0, 0, 20, 0)
    },
    {
      form: goodForms[0].formId,
      submissionId: 'sub2',
      facility: goodFacilities[0].name,
      person: goodPeople[0].name,
      deviceId: 'dev1',
      simSerial: 'sim1',
      formStartDate: new Date(2015, 1, 1, 0, 0, 0, 0),
      formEndDate: new Date(2015, 1, 1, 0, 0, 20, 0),
      completedDate: new Date(2015, 1, 1, 0, 0, 30, 0)
    },
    {
      form: goodForms[1].formId,
      submissionId: 'sub3',
      facility: goodFacilities[1].name,
      person: goodPeople[1].name,
      deviceId: null,
      simSerial: null,
      formStartDate: new Date(2015, 1, 1, 0, 0, 0, 0),
      formEndDate: new Date(2015, 1, 2, 0, 0, 10, 0),
      completedDate: new Date(2015, 1, 2, 0, 0, 25, 0)
    }
  ];

  describe('submission entity methods', () => {

    var matchSubmissionPair = submission => {
      var match = _.find(goodSubmissions, good =>
        good.submissionId === submission.submissionId);
      return {submission, match};
    };

    it('should save new submissions', done => {
      return client.saveSubmissions(goodSubmissions)
      .then(results => expect(results).to.have.length(goodSubmissions.length))
      .then(() => done());
    });

    it('should retrieve submissions by submissionIds', done => {
      var submissionIds = goodSubmissions.map(sub => sub.submissionId);

      return client.getSubmissions({submissionIds})
      .tap(submissions =>
        expect(submissions).to.have.length(goodSubmissions.length)
      )
      .map(matchSubmissionPair)
      .each(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(
          datadb.omitDBCols(pair.submission)
        );
      })
      .then(() => done());
    });

    it('should retrieve an individual submission by submissionId', done => {
      var target = goodSubmissions[1];
      return client.getSubmission({submissionId: target.submissionId})
      .then(matchSubmissionPair)
      .then(pair => {
        expect(pair.match).to.be.defined;
        expect(pair.match).to.deep.equal(
          datadb.omitDBCols(pair.submission)
        );
      })
      .then(() => done());
    });

    it('should return submissions default sorted by completed_date', done => {
      return client.getSubmissions({
        submissionIds: goodSubmissions.map(sub => sub.submissionId)
      })
      .then(results => {
        var last = results[0];
        return BPromise.each(results.slice(1), submission => {
          expect(last.completedDate.getTime()).to.be.above(
            submission.completedDate.getTime()
          );
          last = submission;
        });
      })
      .then(() => done());
    });

    it('should update submissions with ids');

  });

  const goodUpdates = [
    {
      submissionId: goodSubmissions[0].submissionId,
      submissionNumber: 1,
      stId: goodSamples[0].stId,
      labId: goodSamples[0].labId,
      sampleStatus: 'ok'
    },
    {
      submissionId: goodSubmissions[0].submissionId,
      submissionNumber: 2,
      stId: goodSamples[1].stId,
      labId: goodSamples[1].labId,
      sampleStatus: 'broken'
    },
    {
      submissionId: goodSubmissions[0].submissionId,
      submissionNumber: 3,
      stId: goodSamples[2].stId,
      labId: goodSamples[2].labId,
      sampleStatus: 'ok'
    },
    {
      submissionId: goodSubmissions[1].submissionId,
      submissionNumber: 1,
      stId: goodSamples[3].stId,
      labId: goodSamples[3].labId,
      sampleStatus: 'ok'
    },
    {
      submissionId: goodSubmissions[1].submissionId,
      submissionNumber: 2,
      stId: goodSamples[4].stId,
      labId: goodSamples[4].labId,
      sampleStatus: 'ok'
    }
  ];

  describe('updates entity methods', () => {
    it('should save new updates', done => {
      return client.saveUpdates(goodUpdates)
      .then(results => expect(results).to.have.length(goodUpdates.length))
      .then(() => done());
    });

    it('should throw a validation error for dupe submissionId/Number', done => {
      var dupeSample = Object.assign(goodUpdates[0]);
      dupeSample.stId = 'st99';
      dupeSample.labId = null;
      dupeSample.sampleStatus = 'broken';
      return client.saveUpdates([dupeSample])
      .then(results => expect(results).to.be.undefined)
      .catch(err =>
        expect(err).to.be.instanceof(storage.Sequelize.UniqueConstraintError,
          'duplicate submissionId/Number values violate the unique contraint')
      )
      .then(() => done());
    });

    it('should retrieve updates by updateIds');

    it('should retrieve an individual update by updateId');

    it('should update updates with ids');

  });

});
