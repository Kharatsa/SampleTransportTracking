'use strict';

const util = require('util');
const ModelClient = require('app/server/stt/clients/modelclient.js');
const sttquery = require('app/server/stt/sttquery.js');

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
  return sttquery.labTests.typesAndSampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

/**
 * [description]
 * @param {QueryOptions} options [description]
 * @return {Promise.<Array.<Object>>}          [description]
 */
LabTestsClient.prototype.bySampleIds = function(options) {
  return sttquery.labTests.sampleIds(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new LabTestsClient(options);
};
