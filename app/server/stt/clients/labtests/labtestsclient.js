'use strict';

/** @module stt/sttclient/labtests */

const util = require('util');
const ModelClient = require('server/stt/clients/modelclient.js');
const labtestsquery = require('./labtestsquery.js');

/**
 * @class Lab Tests database client
 * @param {Object} options [description]
 */
function LabTestsClient(options) {
  ModelClient.call(this, options);
}
util.inherits(LabTestsClient, ModelClient);

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
LabTestsClient.prototype.byTypesAndSampleIds = function(options) {
  return labtestsquery.typesAndSampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
LabTestsClient.prototype.bySampleIds = function(options) {
  return labtestsquery.sampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new LabTestsClient(options);
};
