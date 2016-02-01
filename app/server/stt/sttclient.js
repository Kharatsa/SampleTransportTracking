'use strict';

const log = require('app/server/util/logapp.js');
const sampleidsclient = require('app/server/stt/clients/sampleidsclient.js');
const metadataclient = require('app/server/stt/clients/metadataclient.js');
const artifactsclient = require('app/server/stt/clients/artifactsclient.js');
const labtestsclient = require('app/server/stt/clients/labtestsclient.js');
const changesclient = require('app/server/stt/clients/changesclient.js');

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

  this.sampleIds = sampleidsclient({model: options.models.SampleIds});
  this.metadata = metadataclient({model: options.models.Metadata});
  this.artifacts = artifactsclient({model: options.models.Artifacts});
  this.labTests = labtestsclient({model: options.models.LabTests});
  this.changes = changesclient({
    model: options.models.Changes,
    includes: {
      Artifacts: options.models.Artifacts,
      LabTests: options.models.LabTests,
      SampleIds: options.models.SampleIds
    }
  });
}

module.exports = function(options) {
  return new STTClient(options);
};
