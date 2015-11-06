'use strict';

const express = require('express');
const router = express.Router();
const server = require('app/server/server.js');
const log = require('app/server/util/log.js');

router.get('/ids', function(req, res) {
  return server.sampleTracker.allIds()
  .then(function(ids) {
    res.json(ids);
  });
});

router.get('/id/:id', function(req, res) {
  if (!req.params.id) {
    res.status(400).json({});
  }
  return server.sampleTracker.allSampleEvents(req.params.id)
  .then(function(result) {
    log.debug('sampleTracker results', result);
    var data = {message: '', events: result};
    if (result.length === 0) {
      data.message = ('No events for ID ' + req.params.id || null + '');
    }
    res.json(data);
  });
});

module.exports = router;
