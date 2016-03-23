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

router.get('/changes', offset(client.changes.limit), (req, res, next) => {
  return client.changes.latest({offset: req.offset, allowEmpty: true})
  .then(results => res.json(results))
  .catch(next);
});

router.get('/facility/:facilityKey/changes', lowerCaseQueryKeys, dateRange,
  (req, res, next) => {
    return client.changes.allChanges({data: {
      facilityKey: req.params.facilityKey,
      afterDate: req.query.afterdate,
      beforeDate: req.query.beforedate
    }})
    .then(results => res.json(results))
    .catch(next);
  }
);

router.get('/region/:regionKey/changes', lowerCaseQueryKeys, dateRange,
  (req, res, next) => {
    return client.changes.allChanges({data: {
      regionKey: req.params.regionKey,
      afterDate: req.query.afterdate,
      beforeDate: req.query.beforedate
    }})
    .then(results => res.json(results))
    .catch(next);
  }
);

module.exports = router;
