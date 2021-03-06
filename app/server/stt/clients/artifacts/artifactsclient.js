'use strict';

const util = require('util');
const ModelClient = require('server/stt/clients/modelclient.js');
const artifactsquery = require('./artifactsquery.js');

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
  return artifactsquery.typesAndSampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new ArtifactsClient(options);
};
