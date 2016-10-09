'use strict';

const BPromise = require('bluebird');
const util = require('util');
const ModelClient = require('server/stt/clients/modelclient.js');
const sampleidsquery = require('./sampleidsquery.js');

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

const DEFAULT_SORT = [['createdAt', 'DESC']];

/**
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.latest = function(options) {
  return this.Model.findAndCountAll({
    offset: options.offset === undefined ? null : options.offset,
    limit: options.limit === undefined ? this.limit : options.limit,
    order: DEFAULT_SORT
  });
};

const allReferences = self => ([
  {
    model: self.includes.Artifacts,
    include: [{model: self.includes.Changes}]
  }, {
    model: self.includes.LabTests,
    include: [{model: self.includes.Changes}]
  }
]);

/**
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.eitherIds = function(options) {
  let include;

  // TODO: maybe make this "includes" option common to all stt clients sttOptions
  if (typeof options.includes === 'undefined' || options.includes === true) {
    try {
      include = allReferences(this);
    } catch (e) {
      return BPromise.reject(e);
    }
  }

  return sampleidsquery.eitherIds(options.data)
  .then(where => this.Model.findAll({
    where,
    offset: options.offset === undefined ? null : options.offset,
    limit: options.limit === undefined ? this.limit : options.limit,
    include
  }));
};

/**
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
SampleIdsClient.prototype.byStIds = function(options) {
  return sampleidsquery.stIds(options.data)
  .then(where => Object.assign({}, options, {where}))
  .then(options => this.Model.findAll(options));
};

module.exports = function(options) {
  return new SampleIdsClient(options);
};
