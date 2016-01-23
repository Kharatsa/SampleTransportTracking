'use strict';

const BPromise = require('bluebird');
// const log = require('app/server/util/logapp.js');
const datadb = require('app/server/util/datadb.js');

const findAllWhere = (Model, where) => {
  let query;
  if (where.then) {
    query = where.then(result => Model.findAll({where: result}));
  } else {
    query = Model.findAll({where});
  }
  return query.map(datadb.makePlain).map(datadb.omitDateDBCols);
};

/**
 * [fetchLocalWithColAndRef description]
 *
 * @method fetchLocalWithColAndRef
 * @param {!Object} options [description]
 * @param  {!Sequelize.Model} options.model [description]
 * @param  {!string} options.refKey    [description]
 * @param  {!string} options.refVal    [description]
 * @param  {!string} options.itemKey   [description]
 * @param  {!Array.<Object>} items     [description]
 * @return {Promise.<Array.<Object>>}           [description]
 * @throws {Error} If [missing required parameter]
 */
const fetchLocalWithColAndRef = BPromise.method(options => {
  if (!(options && options.refKey && options.refVal && options.itemKey &&
        options.items)) {
    throw new Error('Missing required options parameter');
  }

  return BPromise.map(options.items, item => {
    let refClause = {};
    refClause[options.refKey] = options.refVal;

    let keyClause = {};
    keyClause[options.itemKey] = item[options.itemKey];

    return {$and: [refClause, keyClause]};
  })
  .then(ands => ({$or: ands}))
  .then(where => options.model.findAll({where}))
  .map(datadb.makePlain)
  .map(datadb.omitDateDBCols);
});

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
    .map(datadb.makePlain);
  }
  return [];
});

/**
 * Returns a collection of Objects from merged that should be updated in the
 * database. In these cases, there is a value present in the local property of
 * the merged object, but the values props do not match the value props in the
 * merged incoming object.
 *
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<MergedData>>}        [description]
 */
const mergedForUpdate = merged => {
  return BPromise.filter(merged, item => !!item.local)
  .filter(item => !datadb.commonPropsEqual(item.incoming, item.local));
};

/**
 * Returns a collection of Objects from merged that should be inserted in the
 * database, given that the paired/merged local parameter is falsy. The absense
 * of a value in the local property indicates that the object in incoming has
 * no version already present in the local database.
 *
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<Object>>}        [description]
 */
const incomingForInsert = merged => {
  return BPromise.filter(merged, item => !item.local)
  .map(item => item.incoming);
};

/**
 * [description]
 * @param  {Array.<MergedData>} merged [description]
 * @return {Promise.<Array.<Object>>}        [description]
 */
const localToSkip = merged => {
  return BPromise.filter(merged, item => !!item.local)
  .filter(item => datadb.commonPropsEqual(item.incoming, item.local))
  .map(item => item.local);
};

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

    const doInserts = incomingForInsert(options.merged)
    .then(filtered => options.model.bulkCreate(filtered, {validate: true}))
    .map(datadb.makePlain);

    const doUpdates = mergedForUpdate(options.merged)
    .then(filtered => persistMergedUpdates(
      {model: options.model, modelPKs: options.modelPKs, items: filtered}
    ));

    return BPromise.join(
      doInserts, doUpdates, localToSkip(options.merged),
      (inserted, updated, skipped) => ({inserted, updated, skipped})
    );
  } else {
    return BPromise.resolve({inserted: [], updated: [], skipped: []});
  }
});

module.exports = {
  findAllWhere,
  fetchLocalWithColAndRef,
  persistMergedData
};
