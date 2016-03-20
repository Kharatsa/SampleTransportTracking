'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const metaquery = require('./metaquery.js');

function MetaClient(options) {
  ModelClient.call(this, options);
}
util.inherits(MetaClient, ModelClient);

MetaClient.prototype.byKey = function(options) {
  return metaquery.key(options.data)
  .then(where => this.Model.findAll({where}));
};

MetaClient.prototype.all = function() {
  return this.Model.findAll({});
};

module.exports = MetaClient;
