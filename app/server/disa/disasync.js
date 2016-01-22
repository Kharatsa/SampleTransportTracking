'use strict';

// const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const datadb = require('app/server/util/datadb.js');
const datasync = require('app/server/util/datasync.js');

/**
 * Return all lab tests for a given sample id record (by reference/uuid)
 *
 * @param  {string} sampleRef [description]
 * @return {Promise.<Array.<string>>}           [description]
 */
const sampleIdsLabTests = sampleRef => {
  return storage.models.LabTests.findAll({where: {sampleId: sampleRef}})
  .map(datadb.makePlain)
  .map(datadb.omitDateDBCols);
};

/**
 * [fetchLocalSampleIds description]
 * @param  {Object} sampleIds [description]
 * @return {Promise.<Object>}           [description]
 */
const fetchLocalSampleIds = sampleIds => {
  log.debug(`Looking for sample with stId=${sampleIds.stId}`);

  return storage.models.SampleIds.findOne({where: {stId: sampleIds.stId}})
  .then(datadb.makePlain)
  .then(datadb.omitDateDBCols);
};

/**
 * [fetchLocalLabTests description]
 * @param  {string} sampleIdsRef [description]
 * @param  {Array.<Object>} labTests     [description]
 * @return {Promise.<Array.<Object>>}              [description]
 */
const fetchLocalLabTests = (sampleIdsRef, labTests) => {
  return datasync.fetchLocalWithColAndRef({
    model: storage.models.LabTests,
    refKey: 'sampleId',
    refVal: sampleIdsRef,
    itemKey: 'testType',
    items: labTests
  });
};

/**
 * [fetchLocalMeta description]
 * @param  {Object} meta [description]
 * @return {Promise.<Object>}      [description]
 */
const fetchLocalMeta = meta => {
  return BPromise.map(meta, item => (
    {$and: [{type: item.type}, {key: item.key}]}
  ))
  .then(ands => ({$or: ands}))
  .then(where => storage.models.Metadata.findAll({where}))
  .map(datadb.makePlain)
  .map(datadb.omitDateDBCols);
};

/**
 * [fetchLocalChanges description]
 * @param  {string} labTestRef [description]
 * @param  {Array.<Object>} changes    [description]
 * @return {Promise.<Array.<Object>>}            [description]
 */
const fetchLocalChanges = changes => {
  return BPromise.map(changes, change => {
    if (!(change.labTest && change.statusDate)) {
      throw new Error(`Missing required labTest or statusDate parameter`);
    }
    return {$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]};
  })
  .then(ands => ({$or: ands}))
  .then(where => storage.models.Changes.findAll({where}))
  .map(datadb.makePlain)
  .map(datadb.omitDateDBCols);
};

module.exports = {
  sampleIdsLabTests,
  fetchLocalMeta,
  fetchLocalSampleIds,
  fetchLocalLabTests,
  fetchLocalChanges
};
