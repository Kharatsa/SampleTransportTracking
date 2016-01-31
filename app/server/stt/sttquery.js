'use strict';

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

const wrapOr = ands =>  ({$or: ands});

/**
 * [description]
 * @method metaKeyAndType
 * @param  {Array.<Object>} meta [description]
 * @return {Promise.<Object>}      [description]
 */
const metaTypesAndKeys = queryutils.requireProps(['type', 'key'], meta =>
  BPromise.map(meta, one => ({$and: [{type: one.type}, {key: one.key}]}))
  .then(wrapOr)
);

/**
 * [description]
 * @method metaTypes
 * @param  {string} meta [description]
 * @return {Promise.<Object>}      [description]
 */
const metaType = type => BPromise.resolve({type});

/**
 * [description]
 * @method sampleIdsStIds
 * @param  {Array.<Object>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const sampleIdsStIds = queryutils.requireProps(['stId'], ids =>
  BPromise.map(ids, id => ({stId: id.stId}))
  .then(wrapOr)
);

/**
 * [description]
 * @param  {Array.<string>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const sampleIdsEitherIds = ids => {
  const byStId = BPromise.filter(ids, queryutils.deepTruthy)
    .map(id => ({stId: id}));
  const byLabId = BPromise.filter(ids, queryutils.deepTruthy)
    .map(id => ({labId: id}));

  return BPromise.join(byStId, byLabId)
  .spread((whereStId, whereLabId) => [].concat(whereStId, whereLabId))
  .then(wrapOr);
};

/**
 * [description]
 * @method testsSampleRefs
 * @param  {Array.string} sampleRefs [description]
 * @return {Promise.<Object>}
 */
const testsSampleRefs = queryutils.requireProps(['sampleId'], tests =>
  BPromise.map(tests, item => ({sampleId: item.sampleId}))
  .then(wrapOr)
);

/**
 * [description]
 * @method testsTypes
 * @param  {Array.<Object>} tests [description]
 * @return {Promise.<Object>}       [description]
 */
const testsTypes = queryutils.requireProps(['testType', 'sampleId'], tests =>
  BPromise.map(tests, item =>
    ({$and: [{testType: item.testType}, {sampleId: item.sampleId}]})
  )
  .then(wrapOr)
);

/**
 * [description]
 * @method artfactsTypes
 * @param  {Array.<Object>} artifacts [description]
 * @return {Promise.<Object>}           [description]
 */
const artifactsTypes = queryutils.requireProps(['artifactType', 'sampleId'],
  artifacts => BPromise.map(artifacts, item =>
    ({$and: [{artifactType: item.artifactType}, {sampleId: item.sampleId}]})
  )
  .then(wrapOr)
);

/**
 * [description]
 * @method changesTestsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const changesTestsAndDate = queryutils.requireProps(['labTest', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]})
  )
  .then(wrapOr)
);

/**
 * [description]
 * @method changesArtifactsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const changesArtifactsAndDate = queryutils.requireProps(
  ['artifact', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{artifact: change.artifact}, {statusDate: change.statusDate}]})
  )
  .then(wrapOr)
);

module.exports = {
  metadata: {
    type: metaType,
    typesAndKeys: metaTypesAndKeys
  },

  sampleIds: {
    stIds: sampleIdsStIds,
    eitherIds: sampleIdsEitherIds
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
