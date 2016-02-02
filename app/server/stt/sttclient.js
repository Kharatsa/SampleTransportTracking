'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const sampleidsclient = require('app/server/stt/clients/sampleidsclient.js');
const metadataclient = require('app/server/stt/clients/metadataclient.js');
const artifactsclient = require('app/server/stt/clients/artifactsclient.js');
const labtestsclient = require('app/server/stt/clients/labtestsclient.js');
const changesclient = require('app/server/stt/clients/changesclient.js');
const dbresult = require('app/server/storage/dbresult.js');

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

  this.sampleIds = sampleidsclient({model: this.models.SampleIds});
  this.metadata = metadataclient({model: this.models.Metadata});
  this.artifacts = artifactsclient({model: this.models.Artifacts});
  this.labTests = labtestsclient({model: this.models.LabTests});
  this.changes = changesclient({
    model: this.models.Changes,
    includes: {
      Artifacts: this.models.Artifacts,
      LabTests: this.models.LabTests,
      SampleIds: this.models.SampleIds
    }
  });
}

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
 * @return {Array.<Object>}
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
