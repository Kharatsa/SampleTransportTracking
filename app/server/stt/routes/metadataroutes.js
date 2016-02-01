'use strict';

const express = require('express');
const router = express.Router();
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const dbresult = require('app/server/storage/dbresult.js');

const client = sttclient({db: storage.db, models: storage.models});

const getMetaType = type => (req, res, next) => {
  return client.metadata.byType({data: type})
  .then(results => res.json(results))
  .catch(err => next(err));
};

const getMetaKey = type => (req, res, next) => {
  return client.metadata.byTypeAndKey({data:
    [{type: type, key: req.params.key}]
  })
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(err => next(err));
};

/**
 * Metadata types
 * @enum {string} MetaTypeEnum
 */
const META_TYPE = {
  ARTIFACT: 'artifact',
  STATUS: 'status',
  PERSON: 'person',
  FACILITY: 'facility',
  REGION: 'region',
  LAB_TEST: 'labtest',
  REJECTION: 'rejection'
};

const getStatus = getMetaType(META_TYPE.STATUS);
const getStatusKey = getMetaKey(META_TYPE.STATUS);
router.get('/meta/status', getStatus);
router.get('/meta/status/:key', getStatusKey);

const getFacilities = getMetaType(META_TYPE.FACILITY);
const getFacilityKey = getMetaKey(META_TYPE.FACILITY);
router.get('/meta/facilities', getFacilities);
router.get('/meta/facilities/:key', getFacilityKey);

const getRegions = getMetaType(META_TYPE.REGION);
const getRegionsKey = getMetaKey(META_TYPE.REGION);
router.get('/meta/regions', getRegions);
router.get('/meta/regions/:key', getRegionsKey);

const getPeople = getMetaType(META_TYPE.PERSON);
const getPeopleKey = getMetaKey(META_TYPE.PERSON);
router.get('/meta/people', getPeople);
router.get('/meta/people/:key', getPeopleKey);

const getArtifacts = getMetaType(META_TYPE.ARTIFACT);
const getArtifactsKey = getMetaKey(META_TYPE.ARTIFACT);
router.get('/meta/artifacts', getArtifacts);
router.get('/meta/artifacts/:key', getArtifactsKey);

const getLabTests = getMetaType(META_TYPE.LAB_TEST);
const getLabTestsKey = getMetaKey(META_TYPE.LAB_TEST);
router.get('/meta/labtest', getLabTests);
router.get('/meta/labtest/:key', getLabTestsKey);

const getRejections = getMetaType(META_TYPE.REJECTION);
const getRejectionsKey = getMetaKey(META_TYPE.REJECTION);
router.get('/meta/rejections', getRejections);
router.get('/meta/rejections/:key', getRejectionsKey);

module.exports = router;
