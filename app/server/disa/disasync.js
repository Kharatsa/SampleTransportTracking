'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const datasync = require('app/server/util/datasync.js');
const datadb = require('app/server/util/datadb.js');

const sampleRefsWhere = sampleRef => ({sampleId: sampleRef});

/**
 * Return all lab tests for a given SampleIds reference
 *
 * @param  {string} sampleRef [description]
 * @return {Promise.<Array.<string>>}           [description]
 */
const sampleIdLabTests = datasync.skipEmpty(sampleRef => {
  if (!sampleRef) {
    log.error();
    throw new Error(`Missing required parameter sampleRef - ${sampleRef}`);
  }
  return datasync.findAllWhere(
    storage.models.LabTests, sampleRefsWhere(sampleRef)
  );
});

const metaWhere = meta => BPromise.map(meta, one =>
  ({$and: [{type: one.type}, {key: one.key}]})
)
.then(ands => ({$or: ands}));

/**
 * [localMeta description]
 * @param  {Object} meta [description]
 * @return {Promise.<Object>}      [description]
 */
const localMeta = datasync.skipEmpty(meta => {
  if (!_.every(meta, one => !!one.key && !!one.type)) {
    throw new Error(`Missing required type or key property ${meta}`);
  }
  return datasync.findAllWhere(storage.models.Metadata, metaWhere(meta));
});

const sampleIdsWhere = sampleIds => ({stId: sampleIds.stId});

/**
 * [localSampleIds description]
 * @param  {Object} sampleIds [description]
 * @return {Promise.<Object>}           [description]
 */
const localSampleIds = BPromise.method(sampleIds => {
  if (!sampleIds) {
    throw new Error(`Missing required sampleIds parameter - ${sampleIds}`);
  }
  return storage.models.SampleIds.findOne({where: sampleIdsWhere(sampleIds)})
  .then(datadb.makePlain)
  .then(datadb.omitDateDBCols);
});

const testsWhere = tests => BPromise.map(tests, test =>
  ({$and: [{testType: test.testType}, {sampleId: test.sampleId}]})
)
.then(ands => ({$or: ands}));

/**
 * [localLabTests description]
 * @param  {Array.<Object>} labTests     [description]
 * @return {Promise.<Array.<Object>>}              [description]
 */
const localLabTests = datasync.skipEmpty(labTests => {
  if (!_.every(labTests, test => !!test.testType && !!test.sampleId)) {
    throw new Error(`Missing testType or sampleId property - ${labTests}`);
  }
  return datasync.findAllWhere(storage.models.LabTests, testsWhere(labTests));
});

const changesWhere = changes => BPromise.map(changes, change =>
  ({$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]})
)
.then(ands => ({$or: ands}));

/**
 * [localChanges description]
 * @param  {Array.<Object>} changes    [description]
 * @return {Promise.<Array.<Object>>}            [description]
 */
const localChanges = datasync.skipEmpty(changes => {
  if (!_.every(changes, change => !!change.labTest && !!change.statusDate)) {
    throw new Error(`Missing required labTest or statusDate parameter
                    ${changes}`);
  }
  return datasync.findAllWhere(storage.models.Changes, changesWhere(changes));
});

module.exports = {
  sampleIdLabTests,
  localMeta,
  localSampleIds,
  localLabTests,
  localChanges
};
