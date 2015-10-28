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
  console.log('App:');
  console.dir(server, {colors: true, depth: 0});

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
  log.debug('Received publisher POST', req.originalUrl);
  server.publishClient.saveSubmissionData(req.body)
  .then(function() {
    res.status(200).send('');
  });
});

module.exports = router;
