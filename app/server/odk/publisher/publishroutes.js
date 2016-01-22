'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const sttmiddleware = require('app/server/sttmiddleware.js');
const publishtransform = require('app/server/odk/publisher/publishtransform.js');
const publishmerge = require('app/server/odk/publisher/publishmerge.js');
const publishsync = require('app/server/odk/publisher/publishsync.js');

// parse application/json
const jsonParser = bodyParser.json();
// Funnel body-parser errors into the application log
router.use(sttmiddleware.handleJSONErrors);

function isPublisherTokenValid(req, res, next) {
  var token = req.body.token || null;
  if (config.odk.PUBLISHER_TOKEN && token === config.odk.PUBLISHER_TOKEN) {
    next();
  } else if (config.odk.PUBLISHER_TOKEN) {
    log.info('Bad token in publisher request', req.body);
    res.status(403).json({'error': 'Invalid publisher token'});
  } else {
    // No publisher token specified by the server, so the request proceeds
    next();
  }
}

router.post('/', jsonParser, isPublisherTokenValid, function(req, res) {
  log.info('Received ODK Aggregate POST', req.body);

  return publishtransform(req.body)
  .then(transformed => {
    log.debug('Transformed publish data:', transformed);
    return publishsync.fetchLocal(transformed)
    .then(local => {
      return publishmerge.merge(local, transformed);
    })
    .tap(merged => {
      log.debug('Finished published data merge', merged);
    })
    .then(publishsync.syncMerged);
  })
  .then(result => {
    log.debug('Finished processing published data', result);
    res.send('');
  })
  .catch(err => {
    log.error('Error parsing published data', err, err.stack);
    res.status(500).send(err.message);
  });
});

module.exports = router;
