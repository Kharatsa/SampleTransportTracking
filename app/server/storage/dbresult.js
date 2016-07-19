'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const moment = require('moment');

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
  if (result && typeof result.get !== 'undefined') {
    return result.get({plain: true});
  }

  // Empty objects are truthy, making it difficult to easily spot whether a
  // query returned any results. This returns `null` when result is `{}` or [].
  if (_.isObject(result) && _.isEmpty(result)) {
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
 * @param  {Object} source
 * @param  {Object} target
 * @param  {string} prop
 * @return {boolean}
 */
const propIsEqual = (source, target, prop) => {
  if (typeof target[prop] === 'undefined') {
    return false;
  }
  // For Date objects, compare the valueOf to ensure identical values
  // evaluate to true for the equals check.
  return (
    (_.isDate(target[prop]) ? target[prop].getTime() : target[prop]) ===
    (_.isDate(source[prop]) ? source[prop].getTime() : source[prop])
  );
}

/**
 * Checks 2 objects for equality. Objects are equal if the target shares all
 * the same properties with the source, and the values for all those properties
 * are also equal.
 *
 * @param  {Object} source
 * @param  {Object} target
 * @return {boolean}
 */
const commonPropsEqual = (source, target) => {
  return Object.keys(source).every(prop => propIsEqual(source, target, prop));
};

/**
 * Checks 2 objects for equality by all enumerated properties.
 *
 * @param  {Object} source [description]
 * @param  {Object} target [description]
 * @param  {Array.<string>} props
 * @return {boolean}
 */
const enumeratedPropsEqual = (source, target, props) => {
  return props.every(prop => {
    return propIsEqual(source, target, prop)
  });
};

/**
 * Replace the specified properties with ISO8601 date strings
 *
 * @param  {Object} result
 * @param  {Array.<string>} propNames
 * @return {Promise.<Object>} Original result with altered date strings
 */
const convertToISODate = (result, propNames) => {
  return BPromise.each(propNames, prop => {
    const dateVal = result[prop] ? moment(result[prop]) : null;
    if (dateVal && dateVal.isValid()) {
      result[prop] = dateVal.toISOString();
    }
  })
  .then(() => result);
};

module.exports = {
  plain,
  oneResult,
  omitDateDBCols,
  omitDBCols,
  commonPropsEqual,
  enumeratedPropsEqual,
  convertToISODate
};
