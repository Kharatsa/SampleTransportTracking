'use strict';

/** @module stt/sttclient/changes */

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const changesquery = require('./changesquery.js');

/**
 * [ChangesClient description]
 * @class Changes database client
 * @param {Object} options [description]
 */
function ChangesClient(options) {
  ModelClient.call(this, options);

  if (!(options.includes && options.includes.Artifacts)) {
    throw new Error('Artifacts Model is a required parameter');
  }
  if (!(options.includes && options.includes.LabTests)) {
    throw new Error('LabTests Model is a required parameter');
  }
  if (!(options.includes && options.includes.SampleIds)) {
    throw new Error('SampleIds Model is a required parameter');
  }
  this.includes = options.includes;
}
util.inherits(ChangesClient, ModelClient);

const DEFAULT_SORT = [['statusDate', 'DESC']];

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.latest = function(options) {
  return this.Model.findAndCountAll({
    offset: options.offset,
    limit: options.limit || this.limit,
    include: [
      {
        model: this.includes.Artifacts,
        include: [{model: this.includes.SampleIds}]
      }, {
        model: this.includes.LabTests,
        include: [{model: this.includes.SampleIds}]
      }
    ],
    order: DEFAULT_SORT
  });
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.byLabTestsAndDates = function(options) {
  return changesquery.labTestsAndDates(options.data)
  .then(where => this.Model.findAll({where}));
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.byArtifactsAndDates = function(options) {
  return changesquery.artifactsAndDates(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new ChangesClient(options);
};
