'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

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

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.latest = function(options) {
  return this.Model.findAll({
    offset: options.offset,
    limit: options.limit,
    include: [
      {
        model: this.includes.Artifacts,
        include: [{model: this.includes.SampleIds}]
      }, {
        model: this.includes.LabTests,
        include: [{model: this.includes.SampleIds}]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.byLabTestsAndDates = function(options) {
  return sttquery.changes.labTestsAndDates(options.data)
  .then(where => this.Model.findAll({where}));
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
ChangesClient.prototype.byArtifactsAndDates = function(options) {
  return sttquery.changes.artifactsAndDates(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new ChangesClient(options);
};
