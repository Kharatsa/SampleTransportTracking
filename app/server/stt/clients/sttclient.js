'use strict';

const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const sampleidsclient = require('server/stt/clients/sampleids');
const artifactsclient = require('server/stt/clients/artifacts');
const labtestsclient = require('server/stt/clients/labtests');
const changesclient = require('server/stt/clients/changes');
const metaclients = require('server/stt/clients/metadata');
const datamerge = require('server/util/datamerge.js');
const dbresult = require('server/storage/dbresult.js');
const summaryqueries = require('./summaries/summaryqueries.js');
const summaryresult = require('./summaries/summaryresult.js');
const turnaroundtime = require('./summaries/turnaroundtime.js');

/** @module stt/sttclient */

/**
 * Creates a new Sample Transport Tracking client.
 * @class
 *
 * @param {!Object} options [description]
 * @param {!Database} options.db [description]
 * @param {!Object} options.models [description]
 * @param {!Sequelize.Model} options.models.SampleIds [description]
 * @param {!Sequelize.Model} options.models.Metadata [description]
 * @param {!Sequelize.Model} options.models.Artifacts [description]
 * @param {!Sequelize.Model} options.models.LabTests [description]
 * @param {!Sequelize.Model} options.models.Changes [description]
 */
function STTClient(options) {
  log.debug('Creating STTClient');

  if (!options.db) {
    throw new Error('Database is a required parameter');
  }
  this.db = options.db;
  this.models = options.models;

  // Metadata clients
  this.metaDistricts = metaclients.districts({
    db: this.db, model: this.models.MetaDistricts});
  this.metaLabs = metaclients.labs({
    db: this.db, model: this.models.MetaLabs});
  this.metaFacilities = metaclients.facilities({
    db: this.db, model: this.models.MetaFacilities});
  // this.metaRegions = metaclients.regions({
  //   db: this.db, model: this.models.MetaRegions});
  this.metaPeople = metaclients.people({
    db: this.db, model: this.models.MetaPeople});
  this.metaArtifacts = metaclients.artifacts({
    db: this.db, model: this.models.MetaArtifacts});
  this.metaLabTests = metaclients.labTests({
    db: this.db, model: this.models.MetaLabTests});
  this.metaStatuses = metaclients.statuses({
    db: this.db, model: this.models.MetaStatuses});
  this.metaRejections = metaclients.rejections({
    db: this.db, model: this.models.MetaRejections});
  this.metaStages = metaclients.stages({
    db: this.db, model: this.models.MetaStages});

  this.sampleIds = sampleidsclient({
    db: this.db,
    model: this.models.SampleIds,
    includes: {
      Changes: this.models.Changes,
      Artifacts: this.models.Artifacts,
      LabTests: this.models.LabTests
    }
  });

  this.artifacts = artifactsclient({
    db: this.db, model: this.models.Artifacts});

  this.labTests = labtestsclient({
    db: this.db, model: this.models.LabTests});

  this.changes = changesclient({
    db: this.db,
    model: this.models.Changes,
    includes: {
      Artifacts: this.models.Artifacts,
      LabTests: this.models.LabTests,
      SampleIds: this.models.SampleIds
    }
  });
}

/**
 * @typedef {Object} SummaryQueryParams
 * @property {Date} afterDate [description]
 * @property {Date} [beforeDate] [description]
 * @property {string} [regionKey] [description]
 * @property {string} [facilityKey] [description]
 */

/**
 * @typedef {Object} SummaryQueryOptions
 * @extends {QueryOptions}
 * @extends {SummaryQueryParams}
 */

const summaryQuery = (self, queryFunc, params) => {
  summaryqueries.checkRequired(params);
  log.debug('summary query params', params);

  return self.db.query(queryFunc(params), {
    bind: params,
    type: self.db.QueryTypes.SELECT
  })
  .map(row => summaryresult.recomposeRawSummary(row, {parent: 'Summary'}));
};

/**
 * @method [artifactCounts]
 * @param {SummaryQueryOptions} options
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
STTClient.prototype.artifactCounts = BPromise.method(function(options) {
  return summaryQuery(this, summaryqueries.artifactStagesRaw, options.data);
});

/**
 * @method [labTestCounts]
 * @param {SummaryQueryOptions} options
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
STTClient.prototype.labTestCounts = BPromise.method(function(options) {
  return summaryQuery(this, summaryqueries.testStatusRaw, options.data);
});

/**
 * @method [labTestCounts]
 * @param {SummaryQueryOptions} options
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
STTClient.prototype.totalCounts = BPromise.method(function(options) {
  return summaryQuery(this, summaryqueries.totalsRaw, options.data);
});

/**
 * @method [stageTATs
 * @param {SummaryQueryOptions} options
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If afterDate is undefined
 */
STTClient.prototype.stageTATs = BPromise.method(function(options) {
  return summaryQuery(this, summaryqueries.stageTATsRaw, options.data)
  .then(results => datamerge.propKeyReduce(
    {items: results, propNames: ['sampleId', 'changeStage', 'changeStatus']}))
  .then(turnaroundtime.calculateTATs);
});

/**
 * @method
 * @param {SummaryQueryOptions} options [description]
 * @throws {Error} If afterDate is undefined
 */
STTClient.prototype.stageDateCounts = BPromise.method(function(options) {
  return summaryQuery(this, summaryqueries.totalsDateSeries, options.data)
  .then(results => datamerge.propKeyReduce(
    {items: results, propNames: ['statusDate'], many: true}));
});

/**
 * [description]
 *
 * @method whereKeysClause
 * @param  {Object} local [description]
 * @param  {Array.<string>} keyNames  [description]
 * @return {Object}       [description]
 */
const whereKeysClause = BPromise.method((local, keyNames) => {
  if (!(local && keyNames && Array.isArray(keyNames))) {
    throw new Error('Missing required options parameter');
  }

  let where = {};
  keyNames.forEach(keyName => {
    where[keyName] = local[keyName];
  });

  return where;
});

/**
 * Update the database with the new data. The data to update is selected with
 * the primary keys specified in PKs. After the update is completed, the
 * same records are selected from the database. This second select is necessary
 * in order to retrieve auto-populated columns (e.g., AUTO_INCREMENT id).
 *
 * @method persistMergedUpdates
 * @param {!Object} options
 * @param  {!string} options.options.modelName  [description]
 * @param  {!Array.<string>} options.PKs [description]
 * @param  {!Array.<MergedData>} options.data  [description]
 * @return {Promise.<Array.<Object>>}        [description]
 * @throws {Error} If [missing required parameter]
 */
STTClient.prototype.modelUpdates = BPromise.method(function(options) {
  if (!(options && options.data && options.PKs)) {
    throw new Error('Missing required options parameter');
  }
  const model = this.models[options.modelName];
  if (!(options.modelName && model)) {
    throw new Error(`Invalid database model ${options.modelName}`);
  }

  if (options.data.length) {
    const makeWheres = BPromise.map(options.data, item =>
      whereKeysClause(item.local, options.PKs)
    );

    const doUpdates = makeWheres.map((where, i) => {
      const values = options.data[i].incoming;
      return model.update(values, {where, limit: 1});
    });

    // Update affected counts return value from doUpdates is discarded
    return BPromise.join(makeWheres, doUpdates)
    .spread(wheres => model.findAll({where: {$or: wheres}}))
    .map(dbresult.plain);
  }
  return [];
});

/**
 * Conducts inserts and updates for the incoming property objects in the merged
 * collection.
 *
 * @method persistMergedData
 * @param {!Object} options
 * @param  {!Sequelize.Model} options.modelName
 * @param  {!Array.<Object>} options.data  [description]
 * @return {Promise.<Array.<Object>>}
 * @throws {Error} If [missing required parameter]
 */
STTClient.prototype.modelInserts = BPromise.method(function(options) {
  if (!(options && options.data)) {
    throw new Error('Missing required options parameter');
  }
  const model = this.models[options.modelName];
  if (!(options.modelName && model)) {
    throw new Error(`Invalid database model ${options.modelName}`);
  }

  if (options.data && options.data.length) {
    return model.bulkCreate(options.data, {validate: true})
    .map(dbresult.plain);
  }
  return [];
});

module.exports = function(options) {
  return new STTClient(options);
};
