'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

function SampleIdsClient(options) {
  ModelClient.call(this, options);

  if (!(options.includes && options.includes.Artifacts)) {
    throw new Error('Artifacts Model is a required parameter');
  }
  if (!(options.includes && options.includes.LabTests)) {
    throw new Error('LabTests Model is a required parameter');
  }
  if (!(options.includes && options.includes.Changes)) {
    throw new Error('Changes Model is a required parameter');
  }
  this.includes = options.includes;
}
util.inherits(SampleIdsClient, ModelClient);

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.latest = function(options) {
  return this.Model.findAndCountAll({
    offset: options.offset,
    limit: options.limit || this.limit,
    order: [['createdAt', 'DESC']]
  });
};

SampleIdsClient.prototype.eitherIds = function(options) {
  let include;

  // TODO: maybe make this "includes" option common to all stt clients sttOptions
  if (typeof options.includes === 'undefined' || options.includes === true) {
    include = [
      {
        model: this.includes.Artifacts,
        include: [{model: this.includes.Changes}]
      }, {
        model: this.includes.LabTests,
        include: [{model: this.includes.Changes}]
      }
    ];
  }

  return sttquery.sampleIds.eitherIds(options.data)
  .then(where => this.Model.findAll({
    where,
    offset: options.offset,
    limit: options.limit || this.limit,
    include
  }));
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
