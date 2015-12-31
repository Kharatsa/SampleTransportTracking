'use strict';

const chai = require('chai');
const expect = chai.expect;
const BPromise = require('bluebird');
const _ = require('lodash');
const config = require('app/config');
const storage = require('app/server/storage');
const sttModels = require('app/server/stt/models');
const sttclient = require('app/server/stt/sttclient.js');

describe('Sample Transport Tracking Client', () => {
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

    it('should fetch an empty people array', done => {
      return client.getPeople()
      .then(result => {
        expect(result).to.be.empty;
        done();
      });
    });

    it('should fetch an empty facilities array', done => {
      return client.getFacilities()
      .then(result => {
        expect(result).to.be.empty;
        done();
      });
    });

  });


  describe('sample entity methods', () => {

    const goodSamples = [
      {stId: 'st1', labId: null, type: 'blood'},
      {stId: 'st2', labId: null, type: 'sputum'},
      {stId: 'st3', labId: null, type: null},
      {stId: 'st4', labId: 'lab1', type: 'dbs'},
      {stId: 'st5', labId: 'lab2', type: 'urine'}
    ];

    it('should save new samples', done => {
      client.db.transaction(tran => {
        return client.saveSamples(goodSamples, tran)
        .then(results => {
          expect(results).to.have.length(5);
          done();
        });
      });
    });

    it('should retrieve individual samples by stId', done => {
      BPromise.map(goodSamples, sample =>
        BPromise.props({
          result: client.getSample({stId: sample.stId}),
          sample
        })
      )
      .each(item => {
        expect(item.sample).to.deep.equal(
          _.omit(item.result, 'id', 'created_at', 'updated_at')
        );
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
      .each(item => {
        expect(item.sample).to.deep.equal(
          _.omit(item.result, 'id', 'created_at', 'updated_at')
        );
      }).then(() => done());
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
        expect(item.sample).to.deep.equal(
          _.omit(item.result, 'id', 'created_at', 'updated_at')
        )
      ).then(() => done());
    });

    it('should update samples by ids');

  });

  describe('submission entity methods', () => {
    it('should save new submissions');
    it('should retrieve submissions by submissionId');
    it('should retrieve an individual submission by submissionId');
    it('should update submissions by ids');
  });

  describe('facilities entity methods', () => {
    it('should save new facilities');
    it('should retrieve facilities by facilityKeys');
    it('should retrieve an individual facility by facilityKey');
    it('should update facilities by ids');
  });

  describe('people entity methods', () => {
    it('should save new people');
    it('should retrieve people by peopleKeys');
    it('should retrieve an individual person by personKey');
    it('should update people by ids');
  });

  describe('updates entity methods', () => {
    it('should save new updates');
    it('should retrieve updates by updateIds');
    it('should retrieve an individual update by updateId');
    it('should update updates by ids');
  });

});
