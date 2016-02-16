'use strict';

const wrap = require('app/server/util/wrap.js');
const queryutils = require('app/server/storage/queryutils.js');

const DEFAULT_RESULTS_LIMIT = 50;

function ModelClient(options) {
  if (!options.model) {
    throw new Error('Model is a required parameter');
  }
  this.Model = options.model;
  wrap.allClassMethods(this, queryutils.sttOptions);

  this.limit = DEFAULT_RESULTS_LIMIT;
}

module.exports = ModelClient;
