'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
// const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const datasync = require('app/server/util/datasync.js');
// const datadb = require('app/server/util/datadb.js');

const sampleIdsWhere = sampleIds => BPromise.map(sampleIds, id =>
  ({stId: id.stId})
);

/**
 * [localSampleIds description]
 * @param  {Object} sampleIds [description]
 * @return {Promise.<Object>}           [description]
 */
const localSampleIds = datasync.skipEmpty(sampleIds => {
  if (!sampleIds) {
    throw new Error(`Missing required sampleIds parameter - ${sampleIds}`);
  }
  return datasync.findAllWhere(
    storage.models.SampleIds, sampleIdsWhere(sampleIds)
  );
  // return storage.models.SampleIds.findOne({where: sampleIdsWhere(sampleIds)});
});

const artifactsWhere = tests => BPromise.map(tests, item =>
  ({$and: [{artifactType: item.artifactType}, {sampleId: item.sampleId}]})
)
.then(ands => ({$or: ands}));

/**
 * [localLabTests description]
 * @param  {Array.<Object>} artifacts     [description]
 * @return {Promise.<Array.<Object>>}              [description]
 */
const localArtifacts = datasync.skipEmpty(artifacts => {
  if (!_.every(artifacts, item => !!item.artifactType && !!item.sampleId)) {
    throw new Error(`Missing artifact or sampleId property - ${artifacts}`);
  }
  return datasync.findAllWhere(
    storage.models.Artifacts, artifactsWhere(artifacts)
  );
});

const changesWhere = changes => BPromise.map(changes, change =>
  ({$and: [{artifact: change.artifact}, {statusDate: change.statusDate}]})
)
.then(ands => ({$or: ands}));

/**
 * [localChanges description]
 * @param  {Array.<Object>} changes    [description]
 * @return {Promise.<Array.<Object>>}            [description]
 */
const localChanges = datasync.skipEmpty(changes => {
  if (!_.every(changes, change => !!change.artifact && !!change.statusDate)) {
    throw new Error(`Missing required artifact or statusDate parameter
                    ${changes}`);
  }
  return datasync.findAllWhere(storage.models.Changes, changesWhere(changes));
});

module.exports = {
  localSampleIds,
  localArtifacts,
  localChanges
};
