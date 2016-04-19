'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const transformkeys = require('server/middleware/transformkeys.js');
const normalizequery = require('server/middleware/normalizequery.js');
const storage = require('server/storage');
const sttclient = require('server/stt/clients/sttclient.js');
const daterange = require('server/middleware/daterange.js');
const dbresult = require('server/storage/dbresult.js');

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
  const getScanCounts = client.artifactCounts({data: summaryKeyParams(req)});
  const getTestCounts = client.labTestCounts({data: summaryKeyParams(req)});
  const getTotalCounts = client.totalCounts({data: summaryKeyParams(req)})
  .then(dbresult.oneResult);

  return BPromise.join(getScanCounts, getTestCounts, getTotalCounts)
  .spread((scans, tests, totals) => {
    return Object.assign({}, scans, tests, {totalsCount: totals});
  })
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

router.get('/stage[Dd]ates', lowerCaseQueryKeys, dateRange,
  handleDateStageCountsReq);

router.get('/facility/:facilityKey/stage[Dd]ates', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);
router.get('/region/:regionKey/stage[Dd]ates', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);

router.get('/facility/:facilityKey/stages', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);

router.get('/region/:regionKey/stages', lowerCaseQueryKeys,
  dateRange, handleDateStageCountsReq);

const handleTATIdsReq = (req, res, next) => {
  return client.stageTATs({data: summaryKeyParams(req)})
  .then(results => res.json(results))
  .catch(next);
};

router.get('/tat', lowerCaseQueryKeys, dateRange, handleTATIdsReq);
router.get('/facility/:facilityKey/tat',
  lowerCaseQueryKeys, dateRange, handleTATIdsReq);
router.get('/region/:regionKey/tat', lowerCaseQueryKeys, dateRange,
  handleTATIdsReq);

module.exports = router;
