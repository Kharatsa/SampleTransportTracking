'use strict';

/**
 * STTSubmission is responsible for reconciling incoming data submissions with
 * the existing database. The incoming data is compared with existing data to
 * derive the collection of updates and inserts necessary for all models/tables.
 */

const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const datamerge = require('server/util/datamerge.js');
const storage = require('server/storage');
const sttclient = require('server/stt/clients/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

/**
 * @param  {Object} synced [description]
 * @return {Array.<Object>}        [description]
 */
const syncedCombine = synced => (
  [].concat(synced.inserted, synced.updated, synced.skipped)
);

const findAndMakeInserts = (merged, modelName) => {
  return datamerge.inserts(merged)
  .tap(data => console.log('Inserting merged data', data))
  .then(data => client.modelInserts({modelName, data}));
};

const findAndMakeUpdates = (merged, modelName, PKs, compareProps) => {
  return datamerge.updates(merged, compareProps)
  .then(data => client.modelUpdates({modelName, data, PKs}));
};

const updateAndInsert = (merged, options) => {
  const modelName = options.modelName;
  // properties that uniquely identify an object
  const uniqueProps = options.uniqueProps;
  // properties to compare when determining whether an update is necessary
  const compareProps = options.compareProps;

  return BPromise.props({
    inserted: findAndMakeInserts(merged, modelName),
    updated: findAndMakeUpdates(merged, modelName, uniqueProps, compareProps),
    skipped: datamerge.skips(merged),
    deleted: [] // placeholder (not presently used)
  });
};

/**
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
    data: ids, omitDateDBCols: true, includes: false, limit: null
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

  return merge.then(merged =>
    updateAndInsert(merged, {modelName: 'SampleIds', uniqueProps: ['uuid']})
  );
};

const metaHandler = (model, modelName, uniques) => {
  uniques = uniques || ['id'];

  return data => {
    log.info(`${modelName} incoming`, data);
    const merge = model.byKey({data, omitDateDBCols: true, limit: false})
    .tap(local => log.debug(`${modelName} local`, local))
    .then(local => datamerge.pairByProps(data, local, uniques))
    .tap(merged => log.debug(`${modelName} merged`, merged));

    return merge.then(merged =>
      updateAndInsert(
        merged,
        {modelName, uniqueProps: uniques, compareProps: ['key', 'value']}));
  };
};

const metaDistricts = metaHandler(client.metaDistricts, 'MetaDistricts');
const metaLabs = metaHandler(client.metaLabs, 'MetaLabs');
const metaFacilities = metaHandler(client.metaFacilities, 'MetaFacilities');
const metaArtifacts = metaHandler(client.metaArtifacts, 'MetaArtifacts');
const metaLabTests = metaHandler(client.metaLabTests, 'MetaLabTests');
const metaPeople = metaHandler(client.metaPeople, 'MetaPeople');
const metaStatuses = metaHandler(client.metaStatuses, 'MetaStatuses');
const metaRejections = metaHandler(client.metaRejections, 'MetaRejections');
const metaStages = metaHandler(client.metaStages, 'MetaStages');

/**
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const artifacts = incoming => {
  const merge = client.artifacts.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true, limit: null
  })
  .tap(local => log.debug('artifacts local', local))
  .then(local => datamerge.pairByProps(
    incoming, local, ['sampleId', 'artifactType']
  ))
  .tap(merged => log.debug('artifacts merged', merged));

  return merge.then(merged =>
    updateAndInsert(merged, {modelName: 'Artifacts', uniqueProps: ['uuid']})
  );
};

/**
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const labTests = incoming => {
  const merge = client.labTests.byTypesAndSampleIds({
    data: incoming, omitDateDBCols: true, limit: null
  })
  .then(local => datamerge.pairByProps(
    incoming, local, ['sampleId', 'testType']
  ))
  .tap(merged => log.debug('labTests merged', merged));

  return merge.then(merged =>
    updateAndInsert(merged, {modelName: 'LabTests', uniqueProps: ['uuid']})
  );
};

/**
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const scanChanges = incoming => {
  const merge = client.changes.byArtifactsAndDates({
    data: incoming, omitDateDBCols: true, limit: null
  })
  .tap(local => log.debug('scanChanges local', local))
  .then(local => datamerge.pairByProps(incoming, local, ['artifact', 'status']))
  .tap(merged => log.debug('scanChanges merged', merged));

  return merge.then(merged =>
    updateAndInsert(merged, {modelName: 'Changes', uniqueProps: ['uuid']})
  );
};

/**
 * @param  {Array.<Object>} incoming [description]
 * @return {Promise.<Object>}      [description]
 */
const labChanges = incoming => {
  const merge = client.changes.byLabTests({
    data: incoming, omitDateDBCols: true, limit: null
  })
  .tap(local => log.debug('labChanges local', local))
  .then(local => datamerge.pairByProps(incoming, local, ['labTest', 'status']))
  .tap(merged => log.debug('labChanges merged', merged));

  return merge.then(merged =>
    updateAndInsert(
      merged,
      {
        modelName: 'Changes',
        uniqueProps: ['uuid'],
        compareProps: ['stage', 'status', 'labRejection', 'facility']
      }
  ));
};

module.exports = {
  syncedCombine,
  sampleIds,
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
