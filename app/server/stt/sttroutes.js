'use strict';

const express = require('express');
const router = express.Router();
const log = require('app/server/util/log.js');
const normalizeParams = require('app/server/middleware.js').normalizeParams;
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const sttClient = sttclient.create({
  db: storage.db,
  models: storage.models
});

router.get('/updates', normalizeParams, function(req, res, next) {
  return sttClient.getUpdates()
  .then(updates => res.json(updates))
  .catch(err => next(err));
});

router.get('/ids', function(req, res, next) {
  return sttClient.getSamples()
  .then(ids => res.json(ids))
  .catch(err => next(err));
});

router.get('/id/:id', function(req, res) {
  if (!req.params.id) {
    res.status(400).json({});
  }
  return sttClient.allSampleUpdates(req.params.id)
  .then(function(result) {
    log.debug('sampleTracker results', result);
    var data = {message: '', updates: result};
    if (result.length === 0) {
      data.message = ('No updates for ID ' + req.params.id || null + '');
    }
    res.json(data);
  });
});

module.exports = router;
