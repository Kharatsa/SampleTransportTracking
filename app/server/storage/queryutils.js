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

/**
 * [description]
 * @param  {Function} wrappedFunc [description]
 * @return {QueryCallback}             [description]
 */
const sttOptions = wrappedFunc => {
  return function(options) {
    _.defaultsDeep(options || {}, {
      plain: true,
      omitDateDBCols: false,
      omitDBCols: false,
      allowEmpty: false
    });

    let query = null;
    if (options.allowEmpty || (options.data && options.data.length)) {
      // Wrap with resolve in case wrappedFunc doesn't return a Promise
      query = BPromise.resolve(wrappedFunc.call(this, options));
    } else {
      // When allow empty queries is false, and no data option parameter is
      // provided, resolve with an empty result array.
      query = BPromise.resolve([]);
    }

    return query
    .then(instances => {
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

const skipEmpty = wrappedFunc => {
  return BPromise.method(items =>
    !(items && items.length) ? [] : wrappedFunc(items)
  );
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
  skipEmpty,
  findAllWhere
};
