'use strict';

const express = require('express');
const router = express.Router();
const offset = require('app/server/stt/routes/pageoffset.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

router.get('/changes', offset(client.changes.limit), (req, res, next) => {
  return client.changes.latest({offset: req.offset, allowEmpty: true})
  .then(results => res.json(results))
  .catch(next);
});

module.exports = router;
