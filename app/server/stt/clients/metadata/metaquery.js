'use strict';

const BPromise = require('bluebird');
const queryutils = require('app/server/storage/queryutils.js');

/**
 * [description]
 * @method key
 * @param  {Array.string} meta [description]
 * @return {Promise.<Object>}
 */
const key = queryutils.requireProps(['key'], meta =>
  BPromise.map(meta, item => ({key: item.key.toUpperCase()}))
  .then(queryutils.wrapOr)
);

module.exports = {key};
