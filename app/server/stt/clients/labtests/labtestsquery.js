'use strict';

/** @module stt/sttclient/labtests */

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

/**
 * [description]
 * @method testsSampleRefs
 * @param  {Array.string} sampleRefs [description]
 * @return {Promise.<Object>}
 */
const sampleIds = queryutils.requireProps(['sampleId'], tests =>
  BPromise.map(tests, item => ({sampleId: item.sampleId}))
  .then(queryutils.wrapOr)
);

/**
 * [description]
 * @method testsTypes
 * @param  {Array.<Object>} tests [description]
 * @return {Promise.<Object>}       [description]
 */
const typesAndSampleIds = queryutils.requireProps(['testType', 'sampleId'], tests =>
  BPromise.map(tests, item =>
    ({$and: [{testType: item.testType}, {sampleId: item.sampleId}]})
  )
  .then(queryutils.wrapOr)
);

module.exports = {
  sampleIds, typesAndSampleIds
};
