'use strict';

/** @module stt/clients */

const wrap = require('server/util/wrap.js');
const queryutils = require('server/storage/queryutils.js');

const DEFAULT_RESULTS_LIMIT = 50;

/**
 * @typedef {ModelClientOptions}
 * @param {Object} options
 * @param {Sequelize.Model} options.model The Sequelize Model used for queries
 */

/**
 * @class
 * @param {ModelClientOptions} options
 */
function ModelClient(options) {
  if (!options.model) {
    throw new Error('Missing required parameter model');
  }
  if (!options.db) {
    throw new Error('Missing required parameter db');
  }
  this.db = options.db;
  this.Model = options.model;
  wrap.allClassMethods(this, queryutils.sttOptions);

  this.limit = DEFAULT_RESULTS_LIMIT;
}

module.exports = ModelClient;
