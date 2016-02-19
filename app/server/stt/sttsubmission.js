'use strict';

const BPromise = require('bluebird');
const datamerge = require('app/server/util/datamerge.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

/**
 * [description]
 * @param  {Object} synced [description]
 * @return {Array.<Object>}        [description]
 */
const syncedCombine = synced => (
  [].concat(synced.inserted, synced.updated, synced.skipped)
);

const doInsert = (merged, modelName) => {
  return datamerge.inserts(merged)
  .then(data => client.modelInserts({modelName, data}));
};

const doUpdate = (merged, modelName, PKs) => {
  return datamerge.updates(merged)
  .then(data => client.modelUpdates({modelName, data, PKs}));
};

const updateAndInsert = (merged, modelName, updatePKs) => {
  return BPromise.props({
    inserted: doInsert(merged, modelName),
    updated: doUpdate(merged, modelName, updatePKs),
    skipped: datamerge.skips(merged),
    deleted: []
  });
};

/**
 * [description]
 * @param  {Array.<Object>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const sampleIds = incoming => {
  const stIds = BPromise.map(incoming, item => item.stId);
  const labIds = BPromise.map(incoming, item => item.labId);
  const combinedIds = BPromise.join(stIds, labIds, (stId, labId) =>
    [].concat(stId, labId).filter(id => id !== null)
  );

  // throw error when no local record is retrieved and stId is null

  const merge = combinedIds.then(ids => client.sampleIds.eitherIds({
    data: ids, omitDateDBCols: true, includes: false
  }))
  .then(local => datamerge.pairByProps(incoming, local, ['stId']));

  return merge.then(merged => updateAndInsert(merged, 'SampleIds', ['uuid']));
};

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const metadata = incoming => {
  const merge = client.metadata.byTypeAndKey({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['type', 'key']));

  return merge.then(merged => updateAndInsert(merged, 'Metadata', ['id']));
};

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const artifacts = incoming => {
  const merge = client.artifacts.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['artifactType']));

  return merge.then(merged => updateAndInsert(merged, 'Artifacts', ['uuid']));
};

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const labTests = incoming => {
  const merge = client.labTests.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['testType']));

  return merge.then(merged => updateAndInsert(merged, 'LabTests', ['uuid']));
};

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const scanChanges = incoming => {
  const merge = client.changes.byArtifactsAndDates({
    data: incoming, omitDateDBCols: true
  })
  .then(local =>
    datamerge.pairByProps(incoming, local, ['artifact', 'status'])
  );

  return merge.then(merged => updateAndInsert(merged, 'Changes', ['uuid']));
};

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const labChanges = incoming => {
  const merge = client.changes.byLabTestsAndDates({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['labTest', 'status']));

  return merge.then(merged => updateAndInsert(merged, 'Changes', ['uuid']));
};

module.exports = {
  syncedCombine,
  sampleIds,
  metadata,
  artifacts,
  labTests,
  scanChanges,
  labChanges
};
