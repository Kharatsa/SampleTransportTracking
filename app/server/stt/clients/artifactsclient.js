'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

function ArtifactsClient(options) {
  ModelClient.call(this, options);
}
util.inherits(ArtifactsClient, ModelClient);

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ArtifactsClient.prototype.byTypesAndSampleIds = function(options) {
  return sttquery.artifacts.typesAndSampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new ArtifactsClient(options);
};
