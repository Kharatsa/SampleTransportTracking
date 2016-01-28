'use strict';

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

/**
 * [description]
 * @method metaKeyAndType
 * @param  {Array.<Object>} meta [description]
 * @return {Array.<Object>}      [description]
 */
const metaTypesAndKeys = queryutils.requireProps(['type', 'key'], meta =>
  BPromise.map(meta, one => ({$and: [{type: one.type}, {key: one.key}]}))
  .then(ands => ({$or: ands}))
);

/**
 * [description]
 * @method sampleIdsStIds
 * @param  {Array.<Object>} ids [description]
 * @return {Array.<Object>}     [description]
 */
const sampleIdsStIds = queryutils.requireProps(['stId'], ids =>
  BPromise.map(ids, id => ({stId: id.stId}))
  .then(wheres => ({$or: wheres}))
);

/**
 * [description]
 * @method testsSampleRefs
 * @param  {Array.string} sampleRefs [description]
 * @return {Array.<Object>}
 */
const testsSampleRefs = queryutils.requireProps(['sampleId'], tests =>
  BPromise.map(tests, item => ({sampleId: item.sampleId}))
  .then(ands => ({$or: ands}))
);

/**
 * [description]
 * @method testsTypes
 * @param  {Array.<Object>} tests [description]
 * @return {Array.<Object>}       [description]
 */
const testsTypes = queryutils.requireProps(['testType', 'sampleId'], tests =>
  BPromise.map(tests, item =>
    ({$and: [{testType: item.testType}, {sampleId: item.sampleId}]})
  )
  .then(ands => ({$or: ands}))
);

/**
 * [description]
 * @method artfactsTypes
 * @param  {Array.<Object>} artifacts [description]
 * @return {Array.<Object>}           [description]
 */
const artifactsTypes = queryutils.requireProps(['artifactType', 'sampleId'],
  artifacts => BPromise.map(artifacts, item =>
    ({$and: [{artifactType: item.artifactType}, {sampleId: item.sampleId}]})
  )
  .then(ands => ({$or: ands}))
);

/**
 * [description]
 * @method changesTestsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Array.<Object>}         [description]
 */
const changesTestsAndDate = queryutils.requireProps(['labTest', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]})
  )
  .then(ands => ({$or: ands}))
);

/**
 * [description]
 * @method changesArtifactsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Array.<Object>}         [description]
 */
const changesArtifactsAndDate = queryutils.requireProps(
  ['artifact', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{artifact: change.artifact}, {statusDate: change.statusDate}]})
  )
  .then(ands => ({$or: ands}))
);

module.exports = {
  metadata: {
    typesAndKeys: metaTypesAndKeys
  },

  sampleIds: {
    stIds: sampleIdsStIds
  },

  labTests: {
    typesAndSampleIds: testsTypes,
    sampleIds: testsSampleRefs
  },

  artifacts: {
    typesAndSampleIds: artifactsTypes
  },

  changes: {
    labTestsAndDates: changesTestsAndDate,
    artifactsAndDates: changesArtifactsAndDate
  }
};
