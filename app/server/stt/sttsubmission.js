'use strict';

const BPromise = require('bluebird');
const datamerge = require('app/server/util/datamerge.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

// TODO: remove
// const DEBUG = (message, value) => {
//   if (process.env.NODE_ENV === 'test') {
//     console.log(`DEBUG ${message}`);
//     console.dir(value, {depth: 10});
//   }
// };

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

/**
 * [description]
 * @param  {Array.<Object>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const sampleIds = incoming => {
  const merge = client.sampleIds.byStIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['stId']));

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'SampleIds')),
    updated: merge.then(merged => doUpdate(merged, 'SampleIds', ['uuid'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
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

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'Metadata')),
    updated: merge.then(merged => doUpdate(merged, 'Metadata', ['id'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
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

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'Artifacts')),
    updated: merge.then(merged => doUpdate(merged, 'Artifacts', ['uuid'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
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

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'LabTests')),
    updated: merge.then(merged => doUpdate(merged, 'LabTests', ['uuid'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
  // return client.labTests.byTypesAndSampleIds({
  //   data: incoming, omitDateDBCols: true
  // })
  // .then(local => datamerge.pairByProps(incoming, local, ['testType']))
  // .then(merged => datasync.persistMergedData({
  //   model: storage.models.LabTests, merged, modelPKs: ['uuid']
  // }));
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

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'Changes')),
    updated: merge.then(merged => doUpdate(merged, 'Changes', ['uuid'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
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

  return BPromise.props({
    inserted: merge.then(merged => doInsert(merged, 'Changes')),
    updated: merge.then(merged => doUpdate(merged, 'Changes', ['uuid'])),
    skipped: merge.then(datamerge.skips),
    deleted: []
  });
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
