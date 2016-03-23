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
 * @param  {Array.<string>} ids
 * @return {Promise.<Object>}
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

/**
 * @param  {Object} options
 * @param {Date} options.afterDate
 * @param {Date} [options.beforeDate]
 * @return {Promise.<Object>}
 */
const betweenDates = queryutils.requireProps(['afterDate'], options => {
  const afterQuery = {$gte: options.afterDate};
  const beforeQuery = (
    typeof options.beforeDate !== 'undefined' ?
    {$lte: options.afterDate} :
    {}
  );

  return BPromise.resolve({
    createdAt: Object.assign({}, afterQuery, beforeQuery)
  });
});

const originFacility = queryutils.requireProps(['facilityKey'],
  options => BPromise.resolve({origin: options.facilityKey})
);

module.exports = {
  stIds, eitherIds, betweenDates, originFacility
};
