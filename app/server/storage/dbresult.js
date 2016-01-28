'use strict';

const _ = require('lodash');

/**
 * Converts Sequelize instances to plain objects. Empty objects passed to this
 * function will be returned as null. Plain objects passed to this function are
 * returned unmodified.
 *
 * @param  {!Sequelize.Instance|Object} result [description]
 * @return {Object|null}
 */
const plain = result => {
  // If it's a Sequelize instance object, return a plain object
  if (result && result.get) {
    return result.get({plain: true});
  }

  // Empty objects are truthy, making it difficult to easily spot whether a
  // query returned any results. This returns `null` when result is `{}` or [].
  if (result && !Object.keys(result).length) {
    return null;
  }

  // If result is already a plain, non-empty object, just return it unaltered.
  return result;
};

/**
 * Return the first result from an Array of results.
 *
 * @param  {!Array} results
 * @return {Object}
 */
const oneResult = results => results && results.length ? results[0] : {};

const CREATED_COLUMN_NAME = 'createdAt';
const UPDATED_COLUMN_NAME = 'updatedAt';
const omitDateDBCols = result => {
  return _.omit(result, [CREATED_COLUMN_NAME, UPDATED_COLUMN_NAME]);
};

const ID_COLUMN_NAME = 'id';
const UUID_COLUMN_NAME = 'uuid';
const omitDBCols = result =>  {
  return _.omit(omitDateDBCols(result), [ID_COLUMN_NAME, UUID_COLUMN_NAME]);
};

/**
 * Largely mimics the Sequelize Instance equals method, except this function
 * ignores the database-specific `id` column. This function compares a
 * Sequelize instance (fetched from the source database) to a published Object
 * of the same type.
 *
 * http://docs.sequelizejs.com/en/latest/api/instance/#equalsother-boolean
 *
 * @param  {Sequelize.Model} source
 * @param  {Object} target A plain Object
 * @return {boolean}
 */
const commonPropsEqual = (source, target) => {
  return Object.keys(omitDBCols(target)).every(key => {
    if (typeof source[key] === 'undefined') {
      return false;
    }
    // For Date objects, compare the valueOf to ensure identical values
    // evaluate to true for the equals check.
    return (
      (_.isDate(target[key]) ? target[key].getTime() : target[key]) ===
      (_.isDate(source[key]) ? source[key].getTime() : source[key])
    );
  });
};

module.exports = {
  plain,
  oneResult,
  omitDateDBCols,
  omitDBCols,
  commonPropsEqual
};
