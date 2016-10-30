'use strict';

const Sequelize = require('sequelize');
const log = require('server/util/logapp.js');

/**
 * Maintains the database connection and models
 *
 * @param {!Object} options
 * @param {!Object} options.config Options for Sequelize instantiation. See
 *                                http://docs.sequelizejs.com/en/latest/api/sequelize/
 * @param {?Array} [options.models] [description]
 * @event Database#ready
 */
function Database(options) {
  // Store a reference to the Sequelize prototype
  this.Sequelize = Sequelize;

  if (!options.config) {
    throw new Error('Missing required paramater options.config');
  }
  // Initialize the database instance given the config params
  const config = options.config;

  this.connection = new Sequelize(
    config.name, config.username, config.password, config.options);
  this.queryInterface = this.connection.getQueryInterface();

  // Load any models provided up front
  this.models = {};
  const modelSpecs = options.models || [];
  log.debug(`Connecting to database with ${modelSpecs.length} models`);
  modelSpecs.forEach(spec => this.loadModel(spec));
}

/**
 * [loadModel description]
 *
 * @param {!ModelWrapper} modelSpec [description]
 */
Database.prototype.loadModel = function(modelSpec) {
  if (!modelSpec) {
    throw new Error('Missing required parameter options.modelSpec');
  }

  log.info(`Importing Sequelize model: "${modelSpec.name}"`);
  var model = this.connection.import(modelSpec.name, modelSpec.import);
  if (model.hasOwnProperty('associate')) {
    model.associate(this.models);
  }
  this.models[modelSpec.name] = model;
};

var sequelize = null;

module.exports = {
  Sequelize,

  get db() {
    return sequelize && sequelize.connection ? sequelize.connection : null;
  },

  get models() {
    return sequelize && sequelize.models ? sequelize.models : {};
  },

  loadModel: function(modelSpec) {
    if (!sequelize) {
      throw new Error('Database must be initialized before loading models');
    }
    return sequelize.loadModel(modelSpec);
  },

  loadModels: function(models) {
    Object.keys(models).forEach(modelName => this.loadModel(models[modelName]));
  },

  init: function(options) {
    if (sequelize) {
      log.warn('Storage database was previously initialized.');
      return;
    }
    log.info('Initializing database with config', options.config);
    sequelize = new Database(options);
  }
};
