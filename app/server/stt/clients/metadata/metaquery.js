'use strict';

const BPromise = require('bluebird');
const queryutils = require('server/storage/queryutils.js');

/**
 * @method key
 * @param  {Array.<Object>||Object} meta
 * @return {Promise.<Object>}
 * @throws {Error} If [The meta Object or every Array.Object does not have a
 *                     key attribute]
 */
const key = queryutils.requireProps(['key'], meta => {
  if (!Array.isArray(meta)) {
    return BPromise.resolve({key: meta.key.toUpperCase()});
  }
  return BPromise.map(meta, item => ({key: item.key.toUpperCase()}))
  .then(queryutils.wrapOr);
});

const facilityRegion = queryutils.requireProps(['region'], items => {
  if (!Array.isArray(items)) {
    return BPromise.resolve({region: items.region.toUpperCase()});
  }
  return BPromise.map(items, item => ({region: item.region.toUpperCase()}))
  .then(queryutils.wrapOr);
});

module.exports = {key, facilityRegion};
