'use strict';

const express = require('express');
const router = express.Router();
const offset = require('app/server/middleware/pageoffset.js');
const daterange = require('app/server/middleware/daterange.js');
const normalizequery = require('app/server/middleware/normalizequery.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/clients/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});
const dateRange = daterange.dateRangeMiddleware();
const lowerCaseQueryKeys = normalizequery.lowerCaseQueryKeys();
const pageOffset = offset(client.changes.limit);

const handleChangesReq = (req, res, next) => {
  return client.changes.allChangesAndCount({data: {
    sampleId: req.params.sampleId,
    facilityKey: req.params.facilityKey,
    regionKey: req.params.regionKey,
    afterDate: req.query.afterdate,
    beforeDate: req.query.beforedate,
    offset: req.offset
  }})
  .then(results => res.json(results))
  .catch(next);
};

const handleChangesExport = (req, res, next) => {
  return client.changes.allChanges({
    csvResult: true,
    unlimited: true,
    data: {
      sampleId: req.params.sampleId,
      facilityKey: req.params.facilityKey,
      regionKey: req.params.regionKey,
      afterDate: req.query.afterdate,
      beforeDate: req.query.beforedate
    }})
  .then(results => res.send(results))
  .catch(next);
};

const prepCSVRes = (req, res, next) => {
  res.set({
    'Content-Disposition': `attachment; filename=changes-${Date.now()}.csv`,
    'Content-type': 'text/csv'
  });
  next();
};

router.get('/changes.csv',
  pageOffset, lowerCaseQueryKeys, dateRange, prepCSVRes, handleChangesExport);

router.get('/ids/:sampleId/changes.csv',
  pageOffset, lowerCaseQueryKeys, dateRange, prepCSVRes, handleChangesExport);

router.get('/facility/:facilityKey/changes.csv',
  pageOffset, lowerCaseQueryKeys, dateRange, prepCSVRes, handleChangesExport);

router.get('/region/:regionKey/changes.csv',
  pageOffset, lowerCaseQueryKeys, dateRange, prepCSVRes, handleChangesExport);

router.get('/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq);

router.get('/facility/:facilityKey/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq);

router.get('/region/:regionKey/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq);

const handleSampleChangesReq = (req, res, next) => {
  return client.changes.allChangesAndCount({
    unlimited: true,
    data: {sampleId: req.params.sampleId}})
  .then(results => res.json(results))
  .catch(next);
};

// Always return all the changes for an individual Sample ID
router.get('/ids/:sampleId/changes', handleSampleChangesReq);

module.exports = router;
