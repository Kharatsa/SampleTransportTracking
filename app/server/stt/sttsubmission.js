'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const datamerge = require('app/server/util/datamerge.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/clients/sttclient.js');

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

  const fetchLocal = combinedIds.then(ids => client.sampleIds.eitherIds({
    data: ids, omitDateDBCols: true, includes: false
  }))
  .tap(local => log.debug('sampleIds local', local));

  const mergeByStId = fetchLocal
  .then(local => datamerge.pairByProps(incoming, local, ['stId']));

  const mergeByLabId = fetchLocal
  .then(local => datamerge.pairByProps(incoming, local, ['labId']));

  const merge = BPromise.join(mergeByStId, mergeByLabId,
    (mergedStId, mergedLabId) => {
      return incoming.map((sample, index) => {
        if (mergedStId[index] && mergedStId[index].local) {
          return mergedStId[index];
        }
        return mergedLabId[index];
      });
    });

  merge.tap(merged => log.debug('sampleIds merged', merged));

  return merge.then(merged => updateAndInsert(merged, 'SampleIds', ['uuid']));
};

const metaHandler = (model, modelName, uniques) => {
  uniques = uniques || ['key'];

  return data => {
    const merge = model.byKey({data, omitDateDBCols: true})
    .tap(local => log.debug(`${modelName} local`, local))
    .then(local => datamerge.pairByProps(data, local, uniques))
    .tap(merged => log.debug(`${modelName} merged`, merged));

    return merge.then(merged => updateAndInsert(merged, modelName, uniques));
  };
};

const metaRegions = metaHandler(client.metaRegions, 'MetaRegions');
const metaFacilities = metaHandler(client.metaFacilities, 'MetaFacilities');
const metaDistricts = metaHandler(client.metaDistricts, 'MetaDistricts');
const metaLabs = metaHandler(client.metaLabs, 'MetaLabs');
const metaArtifacts = metaHandler(client.metaArtifacts, 'MetaArtifacts');
const metaLabTests = metaHandler(client.metaLabTests, 'MetaLabTests');
const metaPeople = metaHandler(client.metaPeople, 'MetaPeople');
const metaStatuses = metaHandler(client.metaStatuses, 'MetaStatuses');
const metaRejections = metaHandler(client.metaRejections, 'MetaRejections');
const metaStages = metaHandler(client.metaStages, 'MetaStages');

/**
 * [description]
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const artifacts = incoming => {
  const merge = client.artifacts.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true
  })
  .tap(local => log.debug('artifacts local', local))
  .then(local => datamerge.pairByProps(
    incoming, local, ['sampleId', 'artifactType']
  ))
  .tap(merged => log.debug('artifacts merged', merged));

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
  .then(local => datamerge.pairByProps(
    incoming, local, ['sampleId', 'testType']
  ))
  .tap(merged => log.debug('labTests merged', merged));

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
  .tap(local => log.debug('scanChanges local', local))
  .then(local => datamerge.pairByProps(incoming, local, ['artifact', 'status']))
  .tap(merged => log.debug('scanChanges merged', merged));

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
  .tap(local => log.debug('labChanges local', local))
  .then(local => datamerge.pairByProps(incoming, local, ['labTest', 'status']))
  .tap(merged => log.debug('labChanges merged', merged));

  return merge.then(merged => updateAndInsert(merged, 'Changes', ['uuid']));
};

module.exports = {
  syncedCombine,
  sampleIds,
  metaRegions,
  metaFacilities,
  metaDistricts,
  metaLabs,
  metaArtifacts,
  metaLabTests,
  metaPeople,
  metaStatuses,
  metaRejections,
  metaStages,
  artifacts,
  labTests,
  scanChanges,
  labChanges
};
