'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const transformkeys = require('app/server/middleware/transformkeys.js');
const normalizequery = require('app/server/middleware/normalizequery.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/clients/sttclient.js');
const daterange = require('app/server/middleware/daterange.js');
const dbresult = require('app/server/storage/dbresult.js');

const client = sttclient({db: storage.db, models: storage.models});

const dateRange = daterange.dateRangeMiddleware();
const uppercaseParams = transformkeys.upperCaseParamsMiddleware(
  ['facilityKey', 'regionKey']
);
const lowerCaseQueryKeys = normalizequery.lowerCaseQueryKeys();

const summaryKeyParams = req => ({
  facilityKey: req.params.facilityKey,
  regionKey: req.params.regionKey,
  afterDate: req.query.afterdate,
  beforeDate: req.query.beforedate
});

const handleSummaryReq = (req, res, next) => {
  const artifacts = client.artifactCounts({data: summaryKeyParams(req)});
  const labTests = client.labTestCounts({data: summaryKeyParams(req)});
  const totals = client.totalCounts({data: summaryKeyParams(req)})
  .then(dbresult.oneResult);

  return BPromise.props({artifacts, labTests, totals})
  .then(results => res.json(results))
  .catch(next);
};

router.get('/facility/:facilityKey/summary',lowerCaseQueryKeys, dateRange,
  uppercaseParams, handleSummaryReq);

router.get('/region/:regionKey/summary', lowerCaseQueryKeys, dateRange,
  uppercaseParams, handleSummaryReq);

router.get('/summary', lowerCaseQueryKeys, dateRange, handleSummaryReq);

const handleDateStageCountsReq = (req, res, next) => {
  return client.stageDateCounts({data: summaryKeyParams(req)})
  .then(results => res.json(results))
  .catch(next);
};

router.get('/stages', lowerCaseQueryKeys, dateRange,
  handleDateStageCountsReq);

router.get('/facility/:facilityKey/stages', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);

router.get('/region/:regionKey/stages', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);

const handleTATIdsReq = (req, res, next) => {
  return client.stageTATs({data: summaryKeyParams(req)})
  .then(results => res.json(results))
  .catch(next);
};

router.get('/ids/tat', lowerCaseQueryKeys, dateRange, handleTATIdsReq);
router.get('/facility/:facilityKey/ids/tat',
  lowerCaseQueryKeys, dateRange, handleTATIdsReq);
router.get('/region/:regionKey/ids/tat', lowerCaseQueryKeys, dateRange,
  handleTATIdsReq);

module.exports = router;
