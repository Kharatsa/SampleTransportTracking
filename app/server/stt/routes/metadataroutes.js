'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const transformkeys = require('server/middleware/transformkeys.js');
const storage = require('server/storage');
const sttclient = require('server/stt/clients/sttclient.js');
const dbresult = require('server/storage/dbresult.js');

const sttClient = sttclient({db: storage.db, models: storage.models});
const uppercaseParams = transformkeys.upperCaseParamsMiddleware(['key']);

const getMetadata = client => (req, res, next) => {
  return client.all({allowEmpty: true})
  .then(results => res.json(results))
  .catch(next);
};

const getMetaByKey = client => (req, res, next) => {
  return client.byKey({data: {key: req.params.key}})
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(next);
};

const getStatus = getMetadata(sttClient.metaStatuses);
const getStatusKey = getMetaByKey(sttClient.metaStatuses);
router.get('/meta/status', getStatus);
router.get('/meta/status/:key', uppercaseParams, getStatusKey);

const getFacilities = getMetadata(sttClient.metaFacilities);
const getFacilityKey = getMetaByKey(sttClient.metaFacilities);
router.get('/meta/facilities', getFacilities);
router.get('/meta/facilities/:key', uppercaseParams, getFacilityKey);
router.get('/meta/regions/:key/facilities', uppercaseParams,
  (req, res, next) => {
    return sttClient.metaFacilities.byRegionKey({
      data: {region: req.params.key}})
    .then(results => res.json(results))
    .catch(next);
  }
);

const getDistricts = getMetadata(sttClient.metaDistricts);
const getDistrictsKey = getMetaByKey(sttClient.metaDistricts);
router.get('/meta/districts', getDistricts);
router.get('/meta/districts/:key', uppercaseParams, getDistrictsKey);

const getLabs = getMetadata(sttClient.metaLabs);
const getLabsKey = getMetaByKey(sttClient.metaLabs);
router.get('/meta/labs', getLabs);
router.get('/meta/labs/:key', uppercaseParams, getLabsKey);

const getPeople = getMetadata(sttClient.metaPeople);
const getPeopleKey = getMetaByKey(sttClient.metaPeople);
router.get('/meta/people', getPeople);
router.get('/meta/people/:key', uppercaseParams, getPeopleKey);

const getArtifacts = getMetadata(sttClient.metaArtifacts);
const getArtifactsKey = getMetaByKey(sttClient.metaArtifacts);
router.get('/meta/artifacts', getArtifacts);
router.get('/meta/artifacts/:key', uppercaseParams, getArtifactsKey);

const getLabTests = getMetadata(sttClient.metaLabTests);
const getLabTestsKey = getMetaByKey(sttClient.metaLabTests);
router.get('/meta/labtests', getLabTests);
router.get('/meta/labtests/:key', uppercaseParams, getLabTestsKey);

const getRejections = getMetadata(sttClient.metaRejections);
const getRejectionsKey = getMetaByKey(sttClient.metaRejections);
router.get('/meta/rejections', getRejections);
router.get('/meta/rejections/:key', uppercaseParams, getRejectionsKey);

const getStages = getMetadata(sttClient.metaStages);
const getStagesKey = getMetaByKey(sttClient.metaStages);
router.get('/meta/stages', getStages);
router.get('/meta/stages/:key', uppercaseParams, getStagesKey);

router.get('/meta', (req, res, next) => {
  // TODO: optimize this insane 8 query endpoint
  return BPromise.props({
    districts: sttClient.metaDistricts.all({allowEmpty: true}),
    regions: sttClient.metaLabs.all({allowEmpty: true}),
    facilities: sttClient.metaFacilities.all({allowEmpty: true}),
    // regions: sttClient.metaRegions.all({allowEmpty: true}),
    // labs: sttClient.metaLabs.all({allowEmpty: true}),
    people: sttClient.metaPeople.all({allowEmpty: true}),
    artifacts: sttClient.metaArtifacts.all({allowEmpty: true}),
    labTests: sttClient.metaLabTests.all({allowEmpty: true}),
    rejections: sttClient.metaRejections.all({allowEmpty: true}),
    statuses: sttClient.metaStatuses.all({allowEmpty: true}),
    stages: sttClient.metaStages.all({allowEmpty: true})
  })
  .then(results => res.json(results))
  .catch(next);
});

module.exports = router;
