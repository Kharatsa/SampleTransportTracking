'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const server = require('app/server/server.js');
const config = require('app/config.js');
const log = require('app/server/util/log.js');

// parse application/json
router.use(bodyParser.json());

// Funnel body-parser errors into the application log
router.use(function(err, req, res, next) {
  if (err.status) {
    var message = {'error': err.message};
    log.warn('Bad application/json request',
      err.message, err.stack, req.originalUrl
    );
    log.warn('Responding to error with status %s', err.status, message);
    res.status(err.status).json(message);
  } else {
    next(err);
  }
});

function isPublisherTokenValid(req, res, next) {
  var token = req.body.token || null;
  if (config.publisherToken && token === config.publisherToken) {
    next();
  } else if (config.publisherToken) {
    res.status(400).json({'error': 'Invalid publisher token'});
  } else {
    // No publisher token specified by the server, so the request proceeds
    next();
  }
}

router.post('/', isPublisherTokenValid, function(req, res) {
  log.info('Received ODK Aggregate POST', req.body);
  return server.publishClient.saveSubmission(req.body)
  .then(function() {
    res.status(200).send('');
  })
  .error(function(err) {
    log.error('Error saving published submission', err.message, err.stack);
    res.status(500).send(err.message);
  });
});

module.exports = router;
