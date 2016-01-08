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
  type: ['text/xml', 'application/xml']
});

router.put('/metadata',
  passport.authenticate('basic', {session: false}),
  textParser,
  function(req, res) {
    // TODO: Update metadata
    res.status(201).send('YOLO');
  });

router.put('/status',
  passport.authenticate('basic', {session: false}),
  textParser,
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