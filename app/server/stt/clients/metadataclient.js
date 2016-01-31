'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

function MetadataClient(options) {
  ModelClient.call(this, options);
}
util.inherits(MetadataClient, ModelClient);

MetadataClient.prototype.byTypeAndKey = function(options) {
  return sttquery.metadata.typesAndKeys(options.data)
  .then(where => this.Model.findAll({where}))
  .map(meta => meta.normalized());
};

MetadataClient.prototype.byType = function(options) {
  return sttquery.metadata.type(options.data)
  .then(where => this.Model.findAll({where}))
  .map(meta => meta.normalized());
};

module.exports = function(options) {
  return new MetadataClient(options);
};
