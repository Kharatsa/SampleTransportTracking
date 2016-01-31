'use strict';

const express = require('express');
const router = express.Router();
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const dbresult = require('app/server/storage/dbresult.js');

const client = sttclient({db: storage.db, models: storage.models});

const FACILITY_META_TYPE = 'facility';

router.get('/meta/facilities', (req, res, next) => {
  return client.metadata.byType({data: FACILITY_META_TYPE})
  .then(results => res.json(results))
  .catch(err => next(err));
});

router.get('/meta/facilities/:key', (req, res, next) => {
  return client.metadata.byTypeAndKey({data:
    [{type: FACILITY_META_TYPE, key: req.params.key}]
  })
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(err => next(err));
});

module.exports = router;
