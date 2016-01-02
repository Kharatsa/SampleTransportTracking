'use strict';

const _ = require('lodash');
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

const CREATED_COLUMN_NAME = 'created_at';
const UPDATED_COLUMN_NAME = 'updated_at';
const omitDateDBCols = function(obj) {
  return _.omit.call(null, obj, CREATED_COLUMN_NAME, UPDATED_COLUMN_NAME);
};

const ID_COLUMN_NAME = 'id';
const omitDBCols = function(obj) {
  return _.omit.call(null, obj, ID_COLUMN_NAME, CREATED_COLUMN_NAME,
                     UPDATED_COLUMN_NAME);
};

function areCommonPropsEqual(target, other) {
  // Other should share all of target's properties
  return Object.keys(target).every(key => {
    if (typeof other[key] === 'undefined') {
      return false;
    }
    // For Date objects, compare the valueOf to ensure identical values
    // evaluate to true for the equals check.
    return (
      (_.isDate(target[key]) ? target[key].getTime() : target[key]) ===
      (_.isDate(other[key]) ? other[key].getTime() : other[key])
    );
  });
}

/**
 * [_saveBulk description]
 *
 * @method
 * @param  {Sequelize.Model} model [description]
 * @param  {Array.<Object>} items [description]
 * @param  {Sequelize.Transaction} tran  [description]
 * @return {Promise.<Array.<Sequelize.Instance>>}
 * @throws {Error} If [!items || !items.length]
 */
const saveBulk = BPromise.method(function(model, items, tran) {
  if (!(items && items.length)) {
    throw new Error('Items are a required parameter');
  }
  return model.bulkCreate(items, {transaction: tran});
});

/**
 * [_updateBulk description]
 *
 * @method
 * @param  {!Sequelize.Model} model [description]
 * @param  {!Array.<object>} items [description]
 * @param  {?Sequelize.Transaction} tran  [description]
 * @return {Promise.<Array.<number, number>>} The promise returns an array with
 *                                            one or two elements. The first
 *                                            element is always the number of
 *                                            affected rows, while the second
 *                                            element is the actual affected
 *                                            rows (only supported in postgres
 *                                            with options.returning true.)
 * http://docs.sequelizejs.com/en/latest/api/model/#updatevalues-options-promisearrayaffectedcount-affectedrows


 * @throws {Error} If [item.id undefined for any item in items]
 */
const updateBulk = BPromise.method(function(model, items, tran) {
  if (items.length > 0) {

    // Ensure each object in items has an id property
    return BPromise.filter(items, item => !(typeof item.id === 'undefined'))
    .then(result => {

      if (result.length === items.length) {
        return BPromise.map(items, item => {
          return model.update(item, {
            where: {id: item.id},
            transaction: tran
          });
        });
      } else {
        // Do not make any updates if some items are missing the id prop
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
  omitDateDBCols,
  omitDBCols,
  areCommonPropsEqual,
  saveBulk,
  updateBulk
};
