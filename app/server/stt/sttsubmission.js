'use strict';

const datamerge = require('app/server/util/datamerge.js');
const datasync = require('app/server/util/datasync.js');
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

/**
 * [description]
 * @param  {Array.<Object>} ids [description]
 * @return {Array.<Object>}     [description]
 */
const sampleIds = incoming => {
  return client.sampleIds.byStIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['stId']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.SampleIds, merged, modelPKs: ['uuid']
  }));
};

/**
 * [description]
 * @param  {Array.<Object>} meta [description]
 * @return {Array.<Object>}      [description]
 */
const metadata = incoming => {
  return client.metadata.byTypeAndKey({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['type', 'key']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.Metadata, merged, modelPKs: ['id']
  }));
};

const artifacts = incoming => {
  return client.artifacts.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['artifactType']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.Artifacts, merged, modelPKs: ['uuid']
  }));
};

const labTests = incoming => {
  return client.labTests.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['testType']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.LabTests, merged, modelPKs: ['uuid']
  }));
};

const scanChanges = incoming => {
  return client.changes.byArtifactsAndDates({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['artifact', 'status']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.Changes, merged, modelPKs: ['uuid']
  }));
};

const labChanges = incoming => {
  return client.changes.byLabTestsAndDates({
    data: incoming, omitDateDBCols: true
  })
  .then(local => datamerge.pairByProps(incoming, local, ['labTest', 'status']))
  .then(merged => datasync.persistMergedData({
    model: storage.models.Changes, merged, modelPKs: ['uuid']
  }));
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
