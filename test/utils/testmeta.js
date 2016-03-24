'use strict';

const path = require('path');

const basePath = path.join(__dirname, '..', 'data');
const testJsonPath = filename => path.join(basePath, filename);

const metaLabTests = require(testJsonPath('metalabtests.test.json'));
const metaArtifacts = require(testJsonPath('metaartifacts.test.json'));
const metaRegions = require(testJsonPath('metaregions.test.json'));
const metaFacilities = require(testJsonPath('metafacilities.test.json'));
const metaPeople = require(testJsonPath('metapeople.test.json'));
const metaRejections = require(testJsonPath('metarejections.test.json'));
const metaStatuses = require(testJsonPath('metastatuses.test.json'));
const metaStages = require(testJsonPath('metastages.test.json'));

const load = () => {
  const config = require('app/config');
  const log = require('app/server/util/logapp.js');
  const storage = require('app/server/storage');
  storage.init({config: config.db});
  const metamodels = require('app/server/stt/models/metadata');
  const sttmodels = require('app/server/stt/models');
  storage.loadModels(metamodels);
  storage.loadModels(sttmodels);
  const sttsubmission = require('app/server/stt/sttsubmission.js');

  return storage.db.sync()
  .then(() => sttsubmission.metaLabTests(metaLabTests))
  .then(() => sttsubmission.metaArtifacts(metaArtifacts))
  .then(() => sttsubmission.metaRegions(metaRegions))
  .then(() => sttsubmission.metaFacilities(metaFacilities))
  .then(() => sttsubmission.metaPeople(metaPeople))
  .then(() => sttsubmission.metaRejections(metaRejections))
  .then(() => sttsubmission.metaStatuses(metaStatuses))
  .then(() => sttsubmission.metaStages(metaStages))
  .then(() => log.debug('Finished loading test metadata'));
};

module.exports = {
  load,
  metaLabTests,
  metaArtifacts,
  metaRegions,
  metaFacilities,
  metaPeople,
  metaRejections,
  metaStatuses,
  metaStages
};
