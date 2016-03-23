'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');

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
 * Checks 2 objects for equality. Objects are equal if the target shares all
 * the same properties with the source, and the values for all those properties
 * are also equal.
 *
 * @param  {Sequelize.Model} source
 * @param  {Object} target A plain Object
 * @return {boolean}
 */
const commonPropsEqual = (source, target) => {
  return Object.keys(source).every(prop => {
    if (typeof target[prop] === 'undefined') {
      return false;
    }
    // For Date objects, compare the valueOf to ensure identical values
    // evaluate to true for the equals check.
    return (
      (_.isDate(target[prop]) ? target[prop].getTime() : target[prop]) ===
      (_.isDate(source[prop]) ? source[prop].getTime() : source[prop])
    );
  });
};

const recomposeRaw = (data, options) => {
  const template = options.children.reduce((reduced, key) => {
    reduced[key] = {};
    return reduced;
  }, {});

  const parentModelName = options.parent;
  return BPromise.reduce(Object.keys(data), (reduced, key) => {
    const parts = key.split('.');
    const modelName = parts[0];
    const columnName = parts[1];
    if (modelName === parentModelName) {
      reduced[columnName] = data[key];
    } else {
      reduced[modelName][columnName] = data[key];
    }
    return reduced;
  }, template);
};

module.exports = {
  plain,
  oneResult,
  omitDateDBCols,
  omitDBCols,
  commonPropsEqual,
  recomposeRaw
};
