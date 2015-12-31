'use strict';

const BPromise = require('bluebird');
const Sequelize = require('sequelize');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const log = require('app/server/util/log.js');

/** @module publiser/publishreconcile */

const sttClient = sttclient.create({db: storage.db, models: storage.models});

function sampleIdsReducer(ids, sample) {
  if (sample.stId) {
    ids.stId.push(sample.stId);
  }
  if (sample.labId) {
    ids.labId.push(sample.labId);
  }
  return ids;
}

function pullIds(submission) {
  log.debug('Pulling Ids for submission');
  return BPromise.props({
    sampleIds: BPromise.reduce(
      submission.samples,
      sampleIdsReducer,
      {stId: [], labId: []}
    ),
    submissionId: submission.submission.submissionId,
    facilityId: submission.facility.name,
    personId: submission.person.name,
    updateIds: BPromise.map(
      submission.updates,
      update => ({
        submissionId: update.submissionId,
        submissionNumber: update.submissionNumber
      }))
  });
}

/**
 * Retrieve data from the local database given the identifiers from each
 * published resource (e.g., submission, samples).
 *
 * @param  {Array.<Object>} data [description]
 * @return {Array.<Object>}
 */
function fetchLocal(data) {
  log.debug('Publish data fetchLocal for merge', data);

  return BPromise.map(data, pullIds)
  .map(function(ids) {
    log.debug('fetchLocal ids', ids);
    return BPromise.props({
      samples: sttClient.getSamples({sampleIds: ids.sampleIds}),
      submission: sttClient.getSubmission({submissionId: ids.submissionId}),
      facility: sttClient.getFacility({facilityKey: ids.facilityId}),
      person: sttClient.getPerson({personKey: ids.personId}),
      updates: sttClient.getUpdates({updateIds: ids.updateIds})
    });
  })
  .tap(result => {log.debug('fetchLocal result', result);});
}

/**
 * [handleMergeUpdates description]
 *
 * @param  {Array.<Object.<string, PublishMerged>>} merged [description]
 * @return {Promise}
 */
function syncMerged(merged) {
  return sttClient.db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, tran => {

    return BPromise.map(merged, (data, index) => {
      log.debug('syncMerged ' + (index + 1) + ' of ' + merged.length);
      log.debug('data.samples.insert', data.samples.insert);
      return sttClient.saveSamples(data.samples.insert, tran)
      .then(() => {
        log.debug('data.samples.update', data.samples.insert);
        return sttClient.updateSamples(data.samples.update, tran);
      });
    });

  });
}

module.exports = {
  fetchLocal,
  syncMerged
};
