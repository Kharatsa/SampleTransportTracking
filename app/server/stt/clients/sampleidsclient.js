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
SampleIdsClient.prototype.latest = function(options) {
  return this.Model.findAll({
    offset: options.offset,
    limit: options.limit,
    order: [['createdAt', 'DESC']]
  });
};

SampleIdsClient.prototype.eitherIds = function(options) {
  return sttquery.sampleIds.eitherIds(options.data)
  .then(where => Object.assign({}, options, {where}))
  .then(options => this.Model.findAll(options));
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.byStIds = function(options) {
  return sttquery.sampleIds.stIds(options.data)
  .then(where => Object.assign({}, options, {where}))
  .then(options => this.Model.findAll(options));
};

module.exports = function(options) {
  return new SampleIdsClient(options);
};
