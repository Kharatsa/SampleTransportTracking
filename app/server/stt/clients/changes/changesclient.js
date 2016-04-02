'use strict';

/** @module stt/sttclient/changes */

const util = require('util');
const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const changesquery = require('./changesquery.js');
const changesresult = require('./changesresult.js');

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

const handleRawChanges = (csvResult, rawChanges) => {
  if (csvResult) {
    const parseHeaders = changesresult.csvHeader(rawChanges[0]);
    const headerRow = parseHeaders.then(headers => headers.join(','));

    const parseRows = parseHeaders.then(headers =>
      BPromise.map(rawChanges, row => changesresult.csvRow(headers, row)));


    return BPromise.join(headerRow, parseRows, (header, rows) =>
      [].concat(header, rows).join('\n'));
  }
  return BPromise.map(rawChanges, changesresult.recomposeRawChanges);
};

/**
 * @param {QueryOptions} options
 * @param {Date} options.afterDate
 * @param {Date} [options.beforeDate]
 * @param {string} [options.regionKey]
 * @param {string} [options.facilityKey]
 * @param {boolean} [options.unlimited]
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
ChangesClient.prototype.allChanges = BPromise.method(function(options) {
  // Defaults
  const changesParams = Object.assign({}, {
    limit: options.unlimited ? undefined : this.limit
  }, options.data);

  log.debug('Raw query for all changes with params', changesParams);
  return this.db.query(changesquery.changesRaw(changesParams), {
    bind: changesParams,
    type: this.db.QueryTypes.SELECT
  })
  // TODO: maybe stream the big CSV results as they're parsed
  .then(results => handleRawChanges(options.csvResult, results));
});

ChangesClient.prototype.allChangesCount = BPromise.method(function(options) {
  // Count returns the unlimited number of results matching the query
  // parameters for use with paging parameters (i.e., limit & offset).
  const countParams = _.omit(options.data, ['offset', 'limit']);

  log.debug('Raw count query for all changes with params', countParams);
  return this.db.query(changesquery.changesRawCount(countParams), {
    bind: countParams
  })
  .spread(results => results && results.length ? results[0].ChangesCount : 0)
  .tap(count => log.debug(`allChanges count result`, count));
});

ChangesClient.prototype.allChangesAndCount = function(options) {
  const countQuery = this.allChangesCount(options);
  const changesQuery = this.allChanges(options);

  return BPromise.join(countQuery, changesQuery, (count, changes) => ({
    count,
    rows: changes
  }));
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
