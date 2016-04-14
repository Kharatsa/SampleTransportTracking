'use strict';

const path = require('path');
const basePath = path.join(__dirname, '..', 'data');
const testJsonPath = filename => path.join(basePath, filename);

const metaLabTests = require(testJsonPath('metalabtests.test.json'));
const metaArtifacts = require(testJsonPath('metaartifacts.test.json'));
const metaLabs = require(testJsonPath('metalabs.test.json'));
const metaDistricts = require(testJsonPath('metadistricts.test.json'));
const metaFacilities = require(testJsonPath('metafacilities.test.json'));
const metaPeople = require(testJsonPath('metapeople.test.json'));
const metaRejections = require(testJsonPath('metarejections.test.json'));
const metaStatuses = require(testJsonPath('metastatuses.test.json'));
const metaStages = require(testJsonPath('metastages.test.json'));

const load = () => {
  const config = require('config');
  const log = require('server/util/logapp.js');
  const storage = require('server/storage');
  storage.init({config: config.db});
  const metamodels = require('server/stt/models/metadata');
  const sttmodels = require('server/stt/models');
  storage.loadModels(metamodels);
  storage.loadModels(sttmodels);
  const sttsubmission = require('server/stt/sttsubmission.js');

  return storage.db.sync()
  .then(() => sttsubmission.metaDistricts(metaDistricts))
  .then(() => sttsubmission.metaLabs(metaLabs))
  .then(() => sttsubmission.metaFacilities(metaFacilities))
  .then(() => sttsubmission.metaLabTests(metaLabTests))
  .then(() => sttsubmission.metaArtifacts(metaArtifacts))
  .then(() => sttsubmission.metaPeople(metaPeople))
  .then(() => sttsubmission.metaRejections(metaRejections))
  .then(() => sttsubmission.metaStatuses(metaStatuses))
  .then(() => sttsubmission.metaStages(metaStages))
  .then(() => log.debug('Finished loading test metadata'));
};

module.exports = {
  load,
  metaLabs,
  metaDistricts,
  metaFacilities,
  metaLabTests,
  metaArtifacts,
  metaPeople,
  metaRejections,
  metaStatuses,
  metaStages
};
