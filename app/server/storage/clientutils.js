'use strict';

const BPromise = require('bluebird');

/**
 * Converts Sequelize instances to plain objects. Empty objects passed to this
 * function will be returned as null. Plain objects passed to this function are
 * returned unmodified.
 *
 * @param  {!Sequelize.Instance|Object} obj [description]
 * @return {Object|null}
 */
function getSimpleInstance(obj) {
  // If it's a Sequelize instance object, return a plain object
  if (obj && obj.get) {
    return obj.get({plain: true});
  }

  // Empty objects are truthy, making it difficult to easily spot whether a
  // query returned any results. This returns `null` when obj is `{}`.
  if (obj && !Object.keys(obj).length) {
    return null;
  }

  // If obj is already a plain, non-empty object, just return it unaltered.
  return obj;
}

/**
 * Return the first result from an Array of results.
 *
 * @param  {!Array} results
 * @return {Object}
 */
function getOneResult(results) {
  if (results.length > 0) {
    return results[0];
  }
  return {};
}

/**
 * [_saveBulk description]
 *
 * @method
 * @param  {Sequelize.Model} model [description]
 * @param  {Array.<Object>} items [description]
 * @param  {Sequelize.Transaction} tran  [description]
 * @return {Promise.<Array.<affectedCount, affectedRows>>}
 */
const saveBulk = BPromise.method(function(model, items, tran) {
  if (items.length > 0) {
    return model.bulkCreate(items, {transaction: tran});
  }
  return [];
});

/**
 * [_updateBulk description]
 *
 * @method
 * @param  {[type]} model [description]
 * @param  {[type]} items [description]
 * @param  {[type]} tran  [description]
 * @return {[type]}       [description]
 * @throws {Error} If [item.id undefined for any item in items]
 */
const updateBulk = BPromise.method(function(model, items, tran) {
  if (items.length > 0) {
    // Ensure each object in items has an id property
    return BPromise.filter(items, item => !(typeof item.id === 'undefined'))
    .then(result => {
      if (result.length === items.length) {
        // Update the items
        return BPromise.map(items, item => {
          return model.update(item, {
            where: {id: item.id},
            transaction: tran
          });
        });
      } else {
        throw new Error('All update objects must have an `id` property');
      }
    });
  }

  // Nothing to update
  return [];
});

module.exports = {
  getSimpleInstance,
  getOneResult,
  saveBulk,
  updateBulk
};
