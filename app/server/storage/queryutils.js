'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const dbresult = require('app/server/storage/dbresult.js');

const hasPropsDefined = (item, propNames) => {
  return propNames.every(name =>
    item.hasOwnProperty(name) && typeof item[name] !== 'undefined'
  );
};

const havePropsDefined = BPromise.method((items, propNames) => {
  if (!items.every(item => hasPropsDefined(item, propNames))) {
    throw new Error(`Missing one or more required properties: ${propNames}`);
  }
});

/**
 * [description]
 * @param  {Array.<string>} propNames       [description]
 * @param  {Function} wrappedFuncFunc [description]
 * @return {Promise.<Function>}             [description]
 * @throws {Error} If [Object parameters to wrappedFuncFunc do not all have
 *                     propNames properties defined]
 */
const requireProps = (propNames, wrappedFunc) => {
  return items => {
    return havePropsDefined(items, propNames)
    .then(() => wrappedFunc.call(this, items));
  };
};

const deepTruthy = value => {
  if (value === null) {
    return false;
  } else if (typeof value === 'undefined') {
    return false;
  } else if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'number') {
    return !!value;
  } else if (Array.isArray(value)) {
    return !!value.length;
  } else if (typeof value === 'string') {
    return !!value;
  } else if (_.isObject(value)) {
    return !!Object.keys(value).length;
  }
  return !!value;
};

// TODO: add offset handler

/**
 * @typedef {Object} QueryOptions
 * @property {Array.<Object>} data [description]
 * @property {boolean} [plain=true] [description]
 * @property {boolean} [omitDateDBCols=true] [description]
 * @property {boolean} [omitDBCols=false] [description]
 * @property {boolean} [allowEmpty=false] [description]
 */

/**
 * @callback QueryCallback
 * @param {QueryOptions} options [description]
 */

const DEFAULT_LIMIT = 30;
const STT_OPTIONS = [
  'omitDateDBCols', 'omitDBCols', 'plain', 'allowEmpty'
];

/**
 * [description]
 * @param  {Function} wrappedFunc [description]
 * @return {QueryCallback}             [description]
 */
const sttOptions = wrappedFunc => {
  return function(options) {
    _.defaultsDeep(options || {}, {
      limit: DEFAULT_LIMIT,
      offset: 0,
      plain: true,
      omitDateDBCols: false,
      omitDBCols: false,
      allowEmpty: false
    });

    const sequelizeOptions = _.omit(options, STT_OPTIONS);

    let query = null;
    if (options.allowEmpty || (options.data && options.data.length)) {
      // Wrap with resolve in case wrappedFunc doesn't return a Promise
      query = BPromise.resolve(wrappedFunc.call(this, sequelizeOptions));
    } else {
      // When allow empty queries is false, and no data option parameter is
      // provided, resolve with an empty result array.
      query = BPromise.resolve([]);
    }

    return query
    .then(instances => {
      // TODO: support non-array (i.e., object) results
      // TODO: warn if omit settings enabled for non-plain results?
      const results = (options.plain ?
        BPromise.map(instances, dbresult.plain) :
        BPromise.resolve(instances)
      );

      if (options.omitDBCols) {
        return results.map(dbresult.omitDBCols);
      } else if (options.omitDateDBCols) {
        return results.map(dbresult.omitDateDBCols);
      }
      return results;
    });
  };
};

/**
 * [description]
 * @param  {Sequelize.Model} Model [description]
 * @param  {Object} where [description]
 * @return {Array.<Object>}       [description]
 */
const findAllWhere = (Model, where) => {
  // TODO: use options param here instead
  return BPromise.resolve(where)
  .then(where => Model.findAll({where}));
};

module.exports = {
  requireProps,
  sttOptions,
  findAllWhere,
  deepTruthy
};
