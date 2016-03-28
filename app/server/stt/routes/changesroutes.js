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
  return client.changes.allChanges({data: {
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

router.get('/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq
);

router.get('/ids/:sampleId/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq
);

router.get('/facility/:facilityKey/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq
);

router.get('/region/:regionKey/changes',
  pageOffset, lowerCaseQueryKeys, dateRange, handleChangesReq
);

module.exports = router;
