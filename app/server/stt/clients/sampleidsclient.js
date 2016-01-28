'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

function SampleIdsClient(options) {
  ModelClient.call(this, options);
}
util.inherits(SampleIdsClient, ModelClient);

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.byStIds = function(options) {
  return sttquery.sampleIds.stIds(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new SampleIdsClient(options);
};
