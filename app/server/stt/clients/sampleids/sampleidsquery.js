'use strict';

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

/**
 * [description]
 * @method sampleIdsStIds
 * @param  {Array.<Object>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const stIds = queryutils.requireProps(['stId'], ids =>
  BPromise.map(ids, id => ({stId: id.stId}))
  .then(queryutils.wrapOr)
);

/**
 * [description]
 * @param  {Array.<string>} ids [description]
 * @return {Promise.<Object>}     [description]
 */
const eitherIds = ids => {
  const byStId = BPromise.filter(ids, queryutils.deepTruthy)
    .map(id => ({stId: id}));
  const byLabId = BPromise.filter(ids, queryutils.deepTruthy)
    .map(id => ({labId: id}));

  return BPromise.join(byStId, byLabId)
  .spread((whereStId, whereLabId) => [].concat(whereStId, whereLabId))
  .then(queryutils.wrapOr);
};

module.exports = {
  stIds, eitherIds
};
