'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/clients/sttclient.js');
const dbresult = require('app/server/storage/dbresult.js');

const sttClient = sttclient({db: storage.db, models: storage.models});

const getMetadata = client => (req, res, next) => {
  return client.all({allowEmpty: true})
  .then(results => res.json(results))
  .catch(next);
};

const getMetaByKey = client => (req, res, next) => {
  return client.byKey({data: [{key: req.params.key}]})
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(next);
};

const getStatus = getMetadata(sttClient.metaStatuses);
const getStatusKey = getMetaByKey(sttClient.metaStatuses);
router.get('/meta/status', getStatus);
router.get('/meta/status/:key', getStatusKey);

const getFacilities = getMetadata(sttClient.metaFacilities);
const getFacilityKey = getMetaByKey(sttClient.metaFacilities);
router.get('/meta/facilities', getFacilities);
router.get('/meta/facilities/:key', getFacilityKey);

const getRegions = getMetadata(sttClient.metaRegions);
const getRegionsKey = getMetaByKey(sttClient.metaRegions);
router.get('/meta/regions', getRegions);
router.get('/meta/regions/:key', getRegionsKey);

const getPeople = getMetadata(sttClient.metaPeople);
const getPeopleKey = getMetaByKey(sttClient.metaPeople);
router.get('/meta/people', getPeople);
router.get('/meta/people/:key', getPeopleKey);

const getArtifacts = getMetadata(sttClient.metaArtifacts);
const getArtifactsKey = getMetaByKey(sttClient.metaArtifacts);
router.get('/meta/artifacts', getArtifacts);
router.get('/meta/artifacts/:key', getArtifactsKey);

const getLabTests = getMetadata(sttClient.metaLabTests);
const getLabTestsKey = getMetaByKey(sttClient.metaLabTests);
router.get('/meta/labtests', getLabTests);
router.get('/meta/labtests/:key', getLabTestsKey);

const getRejections = getMetadata(sttClient.metaRejections);
const getRejectionsKey = getMetaByKey(sttClient.metaRejections);
router.get('/meta/rejections', getRejections);
router.get('/meta/rejections/:key', getRejectionsKey);

const getStages = getMetadata(sttClient.metaStages);
const getStagesKey = getMetaByKey(sttClient.metaStages);
router.get('/meta/stages', getStages);
router.get('/meta/stages/:key', getStagesKey);

router.get('/meta', (req, res, next) => {
  // TODO: optimize this insane 8 query endpoint
  return BPromise.props({
    facilities: sttClient.metaFacilities.all({allowEmpty: true}),
    regions: sttClient.metaRegions.all({allowEmpty: true}),
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
