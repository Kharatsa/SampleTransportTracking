'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const dbresult = require('app/server/storage/dbresult.js');

const wrapOr = ands => ({$or: ands});

const hasPropsDefined = (item, propNames) => {
  return propNames.every(name =>
    item.hasOwnProperty(name) && typeof item[name] !== 'undefined'
  );
};

const havePropsDefined = BPromise.method((items, propNames) => {
  const subject = Array.isArray(items) ? items : [items];
  if (!subject.every(item => hasPropsDefined(item, propNames))) {
    throw new Error(`Missing one or more required properties: ${propNames}`);
  }
});

/**
 * Throws an error if the parameters passed to the wrapped function do not
 * include the specified attributes. The required attributes or propNames may
 * be passed to the wrapped function within the Object parameter, or within the
 * Objects included in the Array parameter.
 *
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

const STT_OPTIONS = [
  'omitDateDBCols', 'omitDBCols', 'plain', 'allowEmpty'
];

const plainResult = (data, options) => {
  let result;
  if (options.plain && typeof data.rows !== 'undefined') {
    result = BPromise.props({
      count: data.count,
      data: BPromise.map(data.rows, dbresult.plain)
    });
  } else if (options.plain && Array.isArray(data)) {
    result = BPromise.map(data, dbresult.plain);
  } else if (options.plain) {
    result = BPromise.resolve(dbresult.plain(data));
  } else {
    result = BPromise.resolve(data);
  }
  return result;
};

const maybeExcludeDates = (data, options) => {
  let transformFunc = null;
  if (options.omitDBCols) {
    transformFunc = dbresult.omitDBCols;
  } else if (options.omitDateDBCols) {
    transformFunc = dbresult.omitDateDBCols;
  }

  let result = data;
  if (Array.isArray(data) && transformFunc !== null) {
    result = BPromise.map(data, transformFunc);
  } else if (transformFunc !== null) {
    result = BPromise.resolve(transformFunc(data));
  }

  return result;
};

/**
 * [description]
 * @param  {Function} wrappedFunc [description]
 * @return {QueryCallback}             [description]
 */
const sttOptions = wrappedFunc => {
  return function(options) {
    _.defaultsDeep(options || {}, {
      offset: 0,
      plain: true,
      omitDateDBCols: false,
      omitDBCols: false,
      allowEmpty: false
    });

    const sequelizeOptions = _.omit(options, STT_OPTIONS);

    let query = null;
    if (options.allowEmpty || (options.data &&
                              (options.data.length ||
                               Object.keys(options.data).length))
       ) {
      // Wrap with resolve in case wrappedFunc doesn't return a Promise
      query = BPromise.resolve(wrappedFunc.call(this, sequelizeOptions));
    } else {
      // When allow empty queries is false, and no data option parameter is
      // provided, resolve with an empty result array.
      log.info(`Missing data query parameter. Returning empty result set`);
      query = BPromise.resolve([]);
    }

    return query
    .then(results => plainResult(results, options))
    .then(results => maybeExcludeDates(results, options));
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

const makeSelectExpression = (columnNames, queryAlias, outputAlias) => {
  const parts = columnNames.map(name =>
    `${queryAlias}.${name} AS "${outputAlias}.${name}"`);
  return parts.join(', ');
};

module.exports = {
  wrapOr,
  requireProps,
  sttOptions,
  findAllWhere,
  deepTruthy,
  makeSelectExpression
};
