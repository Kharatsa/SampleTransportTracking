'use strict';

const wrap = require('app/server/util/wrap.js');
const queryutils = require('app/server/storage/queryutils.js');

function ModelClient(options) {
  if (!options.model) {
    throw new Error('Model is a required parameter');
  }
  this.Model = options.model;
  wrap.allClassMethods(this, queryutils.sttOptions);
}

module.exports = ModelClient;
