'use strict';

const BPromise = require('bluebird');
// const log = require('app/server/util/logapp.js');
const datamerge = require('app/server/util/datamerge.js');
const dbresult = require('app/server/storage/dbresult.js');

/**
 * [description]
 *
 * @method whereKeysClause
 * @param  {Object} local [description]
 * @param  {Array.<string>} keyNames  [description]
 * @return {Object}       [description]
 */
const whereKeysClause = BPromise.method((local, keyNames) => {
  if (!(local && keyNames && Array.isArray(keyNames))) {
    throw new Error('Missing required options parameter');
  }

  let where = {};
  keyNames.forEach(keyName => {
    where[keyName] = local[keyName];
  });

  return where;
});

/**
 * Update the database with the new items. The data to update is selected with
 * the primary keys specified in modelPKs. After the update is completed, the
 * same records are selected from the database. This second select is necessary
 * in order to retrieve auto-populated columns (e.g., AUTO_INCREMENT id).
 *
 * @method persistMergedUpdates
 * @param {!Object} options
 * @param  {!Sequelize.Model} options.model  [description]
 * @param  {!Array.<string>} options.modelPKs [description]
 * @param  {!Array.<MergedData>} options.items  [description]
 * @return {Promise.<Array.<Object>>}        [description]
 * @throws {Error} If [missing required parameter]
 */
const persistMergedUpdates = BPromise.method(options => {
  if (!(options && options.modelPKs && options.items)) {
    throw new Error('Missing required options parameter');
  }

  if (options.items.length) {
    const makeWheres = BPromise.map(options.items, item =>
      whereKeysClause(item.local, options.modelPKs)
    );

    const doUpdates = makeWheres.map((where, i) => {
      const values = options.items[i].incoming;
      return options.model.update(values, {where, limit: 1});
    });

    // Update affected counts return value from doUpdates is discarded
    return BPromise.join(makeWheres, doUpdates,
      wheres => options.model.findAll({where: {$or: wheres}})
    )
    .map(dbresult.plain);
  }
  return [];
});

/**
 * Conducts inserts and updates for the incoming property objects in the merged
 * collection.
 *
 * @method persistMergedData
 * @param {!Object} options
 * @param  {!Sequelize.Model} options.model
 * @param  {!Array.<MergedData>} options.merged  [description]
 * @param  {!Array.<string>} options.modelPKs When conducting updates,
 *                                            modelPKs specifies which columns
 *                                            to use for identifying a unique
 *                                            record.
 * @return {Array.<Object>}
 * @throws {Error} If [missing required parameter]
 */
const persistMergedData = BPromise.method(options => {
  if (!(options && options.model && options.merged && options.modelPKs)) {
    throw new Error('Missing required options parameter');
  }

  if (options.merged && options.merged.length) {

    const doInserts = datamerge.inserts(options.merged)
    .then(filtered => options.model.bulkCreate(filtered, {validate: true}))
    .map(dbresult.plain);

    const doUpdates = datamerge.updates(options.merged)
    .then(filtered => persistMergedUpdates(
      {model: options.model, modelPKs: options.modelPKs, items: filtered}
    ));

    return BPromise.props({
      inserted: doInserts,
      updated: doUpdates,
      skipped: datamerge.skips(options.merged)
    });

  } else {
    return BPromise.resolve({inserted: [], updated: [], skipped: []});
  }
});

module.exports = {
  persistMergedData
};
