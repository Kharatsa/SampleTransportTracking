'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const datadb = require('app/server/util/datadb.js');

// /**
//  * [findAllOfModel description]
//  * @param  {!Object} options [description]
//  * @param {!Sequelize.Model} options.model [description]
//  * @param {!string} options.column [description]
//  * @param {Array.<string>} options.values [description]
//  * @param {?boolean} [options.simple] [description]
//  * @param {?number} [options.limit] [description]
//  * @return {Promise.<Sequelize.Instance|Object>} [description]
//  * @throws {Error} If [this condition is met]
//  */
// const findAllOfModel = function(options) {
//   if (!options || !options.model) {
//     throw new Error('Missing paramter model');
//   }
//   if (!options || !options.column) {
//     throw new Error('Missing parameter column');
//   }

//   options = _.defaultsDeep(options || {}, {
//     values: [],
//     simple: true
//   });

//   const valuesInClause = {};
//   if (options.values && options.values.length) {
//     valuesInClause[options.column] = {$in: options.values};
//   }

//   return options.model.findAll({
//     where: valuesInClause,
//     limit: options.limit
//   })
//   .then(results => {
//     if (options && options.simple) {
//       return results.map(datadb.makePlain);
//     }
//     return results;
//   });
// };

/**
 * [_saveBulk description]
 *
 * @method
 * @param {Object} options [description]
 * @param  {!Sequelize.Model} options.model [description]
 * @param  {!Array.<Object>} options.items [description]
 * @param  {?Sequelize.Transaction} [options.tran]  [description]
 * @param {boolean} [options.simple] [description]
 * @return {Promise.<Array.<Sequelize.Instance>>}
 * @throws {Error} If [!items || !items.length]
 */
const saveBulk = BPromise.method(function(options) {
  if (!options || !(options.items && options.items.length)) {
    throw new Error('Items are a required parameter');
  }

  options = _.defaultsDeep(options || {}, {
    simple: true
  });

  return options.model.bulkCreate(options.items, {transaction: options.tran})
  .then(results => {
    if (options && options.simple) {
      return BPromise.map(results, datadb.makePlain);
    }
    return results;
  });
});

/**
 * [_updateBulk description]
 *
 * @method
 * @param {!Object} options [description]
 * @param  {!Sequelize.Model} options.model [description]
 * @param  {!Array.<Object>} options.items [description]
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
const updateBulk = BPromise.method(function(options) {
  if (options && options.items.length > 0) {

    // Ensure each object in items has an id property
    return BPromise.filter(options.items,
      item => !(typeof item.id === 'undefined')
    )
    .then(result => {

      if (result.length === options.items.length) {
        return BPromise.map(options.items, item => {
          return options.model.update(item, {
            where: {id: item.id},
            transaction: options.tran
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
  // findAllOfModel,
  saveBulk,
  updateBulk
};
