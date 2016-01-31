'use strict';

const express = require('express');
const router = express.Router();
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const dbresult = require('app/server/storage/dbresult.js');

const client = sttclient({db: storage.db, models: storage.models});

router.get('/ids', (req, res, next) => {
  const offset = req.query.offset;
  return client.sampleIds.latest({offset: offset, allowEmpty: true})
  .then(results => res.json(results))
  .catch(err => next(err));
});

router.get('/ids/:id', (req, res, next) => {
  const offset = req.query.offset;
  return client.sampleIds.eitherIds({offset: offset, data: [req.params.id]})
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(err => next(err));
});

module.exports = router;
