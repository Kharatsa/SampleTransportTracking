'use strict';

const _ = require('lodash');

/**
 * Converts Sequelize instances to plain objects. Empty objects passed to this
 * function will be returned as null. Plain objects passed to this function are
 * returned unmodified.
 *
 * @param  {!Sequelize.Instance|Object} obj [description]
 * @return {Object|null}
 */
function makePlain(obj) {
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

const CREATED_COLUMN_NAME = 'createdAt';
const UPDATED_COLUMN_NAME = 'updatedAt';
const omitDateDBCols = function(obj) {
  return _.omit.call(null, obj, CREATED_COLUMN_NAME, UPDATED_COLUMN_NAME);
};

const ID_COLUMN_NAME = 'id';
const omitDBCols = function(obj) {
  return _.omit.call(null, obj, ID_COLUMN_NAME, CREATED_COLUMN_NAME,
                     UPDATED_COLUMN_NAME);
};

function commonPropsEqual(target, other) {
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

module.exports = {
  makePlain,
  getOneResult,
  omitDateDBCols,
  omitDBCols,
  commonPropsEqual
};
