'use strict';

const express = require('express');
const router = express.Router();
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

router.get('/changes', (req, res, next) => {
  const offset = req.query.offset;
  return client.changes.latest({offset: offset, allowEmpty: true})
  .then(results => res.json(results))
  .catch(err => next(err));
});

module.exports = router;
