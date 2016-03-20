'use strict';

/** @module stt/sttclient/changes */

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

/**
 * [description]
 * @method changesTestsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const labTestsAndDates = queryutils.requireProps(['labTest', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{labTest: change.labTest}, {statusDate: change.statusDate}]})
  )
  .then(queryutils.wrapOr)
);

/**
 * [description]
 * @method changesArtifactsAndDate
 * @param  {Array.<Object>} changes [description]
 * @return {Promise.<Object>}         [description]
 */
const artifactsAndDates = queryutils.requireProps(
  ['artifact', 'statusDate'],
  changes => BPromise.map(changes, change =>
    ({$and: [{artifact: change.artifact}, {statusDate: change.statusDate}]})
  )
  .then(queryutils.wrapOr)
);

module.exports = {
  labTestsAndDates, artifactsAndDates
};
