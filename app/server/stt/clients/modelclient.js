'use strict';

/** @module stt/clients */

const wrap = require('app/server/util/wrap.js');
const queryutils = require('app/server/storage/queryutils.js');

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
    throw new Error('Model is a required parameter');
  }
  this.Model = options.model;
  wrap.allClassMethods(this, queryutils.sttOptions);

  this.limit = DEFAULT_RESULTS_LIMIT;
}

module.exports = ModelClient;
