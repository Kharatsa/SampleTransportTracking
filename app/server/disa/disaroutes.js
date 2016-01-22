'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const BPromise = require('bluebird');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const disatransform = require('app/server/disa/disatransform.js');
const disasubmission = require('app/server/disa/disasubmission.js');
const aggregate = require('app/server/odk/aggregateapi.js');

let passport = null;
let authenticate = null;
if (config.server.isProduction()) {
  passport = require('app/server/auth/httpauth.js');
  authenticate = passport.authenticate('basic', {session: false});
} else {
  authenticate = (req, res, next) => next();
}

// parse XML text
const textParser = bodyParser.text({type: '*/xml'});

function requireMIMETypeXML(req, res, next) {
  if (req.is('*/xml')) {
    return next();
  }
  var err = new Error('Unsupported MIME type "' +
                      req.get('Content-Type') + '"');
  err.status = 415;
  next(err);
}

function requireBody(req, res, next) {
  if (req.body && req.body.length) {
    return next();
  }
  const err = new Error('POST request body cannot be empty');
  err.status = 422;
  next(err);
}

const SUBMISSION_SUCCESS = 'Submission successful';

router.post('/status',
  authenticate,
  requireMIMETypeXML,
  textParser,
  requireBody,
  (req, res, next) => {
    log.info('Received Disa Labs status\n\t', req.body);

    const parseXML = disatransform.parseLabStatusXML(req.body);

    const parseEntities = parseXML.then(parsed =>
      BPromise.props({
        sampleIds: disatransform.parseSampleIds(parsed),
        metadata: disatransform.parseMetadata(parsed),
        labTests: disatransform.parseLabTests(parsed),
        changes: disatransform.parseChanges(parsed)
      })
    )
    .catch(err => {
      log.error('Disa Labs parse entities Error', err.message, err.stack);
      throw err;
    });

    const saveSubmission = parseEntities.then(disasubmission.handleSubmission)
    .catch(err => {
      log.error('Disa Labs save submission Error', err, err.stack);
      throw err;
    });

    const submitODK = parseEntities.then(entities =>
      disatransform.buildLabFormSubmission(
        entities.sampleIds,
        entities.statusDate,
        entities.changes
      )
    )
    .then(aggregate.makeSubmission)
    .spread((odkRes, body) => {
      if (odkRes.statusCode === 201 || odkRes.statusCode === 202) {
        log.info(`Successful ODK lab status submission: ${odkRes.statusCode}
                 - ${odkRes.statusMessage}`);
      } else {
        log.error(`Error with ODK lab status submission: ${odkRes.statusCode}
                 - ${odkRes.statusMessage}`);
      }
      log.info(`Disa Labs submission ODK response body\n${body}`);
      return body;
    })
    .catch(err => {
      log.error('Disa Labs ODK Aggregate submission Error', err.message, err.stack);
      throw err;
    });

    return BPromise.join(saveSubmission, submitODK, (results, odkBody) => {
      log.debug(`Finished saving lab submission: ${results}`);
      log.debug(`ODK Aggregate submission response: ${odkBody}`);
      // TODO: send a meaningful message
      res.status(201).send(SUBMISSION_SUCCESS);
    })
    .catch(err => {
      err.status = 500;
      next(err);
    });
  });

router.all('/*', (req, res, next) => {
  var error = new Error('Not allowed');
  error.status = 405;
  next(error);
});

module.exports = router;
