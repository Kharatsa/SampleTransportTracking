'use strict';

/** @module stt/sttclient/changes */

const util = require('util');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const changesquery = require('./changesquery.js');
const rawqueryutils = require('app/server/stt/clients/rawqueryutils.js');
const dbresult = require('app/server/storage/dbresult.js');

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

  this.db = options.db;
}
util.inherits(ChangesClient, ModelClient);

const allReferences = self => {
  return [
    {
      model: self.includes.Artifacts,
      include: [{model: self.includes.SampleIds}]
    }, {
      model: self.includes.LabTests,
      include: [{model: self.includes.SampleIds}]
    }
  ];
};

const DEFAULT_SORT = [['statusDate', 'DESC']];

/**
 * @param {QueryOptions} options
 * @return {Promise.<Array.<Object>>}
 */
ChangesClient.prototype.latest = function(options) {
  return this.Model.findAndCountAll({
    offset: options.offset,
    limit: options.limit || this.limit,
    include: allReferences(this),
    order: DEFAULT_SORT
  });
};

/**
 * @param {QueryOptions} options
 * @param {Date} options.afterDate
 * @param {Date} [options.beforeDate]
 * @param {string} [options.regionKey]
 * @param {string} [options.facilityKey]
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
ChangesClient.prototype.allChanges = BPromise.method(function(options) {
  const params = options.data || {};
  log.debug('Raw query for all changes with params', params);
  rawqueryutils.checkRequired(params);

  return this.db.query(changesquery.changesRaw(params), {
    bind: params,
    type: this.db.QueryTypes.SELECT
  })
  .map(row => dbresult.recomposeRaw(row, {
    parent: 'Change',
    children: ['Artifact', 'LabTest', 'SampleId']
  }));
});

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
