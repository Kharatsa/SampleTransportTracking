'use strict';

const BPromise = require('bluebird');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const log = require('app/server/util/logapp.js');

/** @module publiser/publishsync */

const client = sttclient({db: storage.db, models: storage.models});

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
      samples: client.getSampleIds({sampleIds: ids.sampleIds}),
      submission: client.getSubmission({submissionId: ids.submissionId}),
      facility: client.getFacility({facilityKey: ids.facilityId}),
      person: client.getPerson({personKey: ids.personId}),
      updates: client.getUpdates({updateIds: ids.updateIds})
    });
  })
  .tap(result => {log.debug('fetchLocal result', result);});
}

/**
 * [handleSync description]
 * @param  {STTClient} client     [description]
 * @param  {Function} syncMethod [description]
 * @param  {Array.<Object>} data       [description]
 * @param  {Sequelize.Transaction} tran       [description]
 * @return {Promise}            [description]
 */
function handleSync(client, syncMethod, data, tran) {
  return BPromise.resolve()
  .then(() => data && data.length ? syncMethod.call(client, data, tran) : null);
}

// TODO: finish implementing update methods
const empty = {noop: () => log.debug('noop')};
const saveSampleIds = handleSync.bind(null, client, client.saveSampleIds);
const updateSampleIds = handleSync.bind(null, client, client.updateSampleIds);
const saveSubmission = handleSync.bind(null, client, client.saveSubmissions);
const updateSubmission = handleSync.bind(null, empty, empty.noop);
const saveFacility = handleSync.bind(null, client, client.saveFacilities);
const updateFacility = handleSync.bind(null, empty, empty.noop);
const savePerson = handleSync.bind(null, client, client.savePeople);
const updatePerson = handleSync.bind(null, empty, empty.noop);
const saveUpdates = handleSync.bind(null, client, client.saveUpdates);
const updateUpdates = handleSync.bind(null, empty, empty.noop);

/**
 * [handleMergeUpdates description]
 *
 * @param  {Array.<Object.<string, PublishMerged>>} merged [description]
 * @return {Promise}
 */
function syncMerged(merged) {
  return client.db.transaction({
    isolationLevel: storage.Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  }, tran => {
    return BPromise.map(merged, (data, index) => {
      log.debug('syncMerged ' + (index + 1) + ' of ' + merged.length);

      // Insert/Updates handled in stages to ensure the necessary cross-
      // references are in place for models with associations.
      return BPromise.all([
        saveFacility(data.facility.insert, tran),
        updateFacility(data.facility.update, tran),
        savePerson(data.person.insert, tran),
        updatePerson(data.person.update, tran),
        saveSampleIds(data.samples.insert, tran),
        updateSampleIds(data.samples.update, tran)
      ])
      .then(() => log.debug('Finished merging facility, person, & samples'))
      .then(() =>
        BPromise.all([
          saveSubmission(data.submission.insert, tran),
          updateSubmission(data.submission.update, tran)
        ])
      )
      .then(() => log.debug('Finished merging submission'))
      .then(() =>
        BPromise.all([
          saveUpdates(data.updates.insert, tran),
          updateUpdates(data.updates.update, tran)
        ])
      )
      .then(() => log.debug('Finished merging submission'));

    });
  });
}

module.exports = {
  fetchLocal,
  syncMerged
};
