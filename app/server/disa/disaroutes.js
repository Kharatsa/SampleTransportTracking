'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateapi.js');
const passport = require('app/server/auth/httpauth.js');
const transform = require('app/server/disa/disatransform.js');

// parse application/json
const textParser = bodyParser.text({
  type: '*/xml'
});

function validateMIMEType(req, res, next) {
  if (req.is('*/xml')) {
    return next();
  }
  var err = new Error('Unsupported MIME type "' + req.get('Content-Type') + '"');
  err.status = 415;
  next(err);
}

function validateBody(req, res, next) {
  if (req.body && req.body.length) {
    return next();
  }
  var err = new Error('POST body cannot be empty');
  err.status = 422;
  next(err);
}

router.post('/metadata',
  passport.authenticate('basic', {session: false}),
  validateMIMEType,
  textParser,
  validateBody,
  function(req, res) {
    // TODO: Update metadata
    res.status(201).send('YOLO');
  });

router.post('/status',
  passport.authenticate('basic', {session: false}),
  validateMIMEType,
  textParser,
  validateBody,
  function(req, res, next) {
    log.debug('Received Disa Labs status\n\t', req.body);
    return transform.parseLabStatus(req.body)
    .then(transform.buildLabForm)
    .then(aggregate.makeSubmission)
    .spread((odkRes, body) => {
      res.status(odkRes.statusCode).send(body);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
  });

module.exports = router;