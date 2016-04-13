'use strict';

const express = require('express');
const router = express.Router();
const offset = require('server/middleware/pageoffset.js');
const storage = require('server/storage');
const sttclient = require('server/stt/clients/sttclient.js');
const dbresult = require('server/storage/dbresult.js');

const client = sttclient({db: storage.db, models: storage.models});

router.get('/ids', offset(client.sampleIds.limit), (req, res, next) => {
  return client.sampleIds.latest({offset: req.offset, allowEmpty: true})
  .then(results => res.json(results))
  .catch(next);
});

router.get('/ids/:id', (req, res, next) => {
  return client.sampleIds.eitherIds({data: [req.params.id], includes: false})
  .then(dbresult.oneResult)
  .then(results => res.json(results))
  .catch(next);
});

module.exports = router;
