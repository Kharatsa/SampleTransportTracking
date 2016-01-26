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
  authenticate = (req, res, next) => next(); // noop
}

// parse XML text
const textParser = bodyParser.text({type: '*/xml'});

const requireXML = (req, res, next) => {
  if (req.is('*/xml')) {
    return next();
  }
  let err = new Error(`Unsupported MIME type '${req.get('Content-Type')}`);
  err.status = 415;
  next(err);
};

const requireBody = (req, res, next) => {
  if (req.body && req.body.length) {
    return next();
  }
  const err = new Error('Request body cannot be empty');
  err.status = 422;
  next(err);
};

const SUBMISSION_SUCCESS = 'Submission successful';

router.post('/status',
  authenticate,
  requireXML,
  textParser,
  requireBody,
  (req, res, next) => {
    log.info('Received Disa Labs status\n\t', req.body);

    const parseXML = disatransform.labStatus(req.body);

    const parseEntities = parseXML.then(parsed =>
      BPromise.props({
        sampleIds: disatransform.sampleId(parsed),
        statusDate: disatransform.labStatusDate(parsed),
        metadata: disatransform.metadata(parsed),
        labTests: disatransform.labTests(parsed),
        changes: disatransform.labChanges(parsed)
      })
    );
    const saveSubmission = parseEntities.then(disasubmission.handleSubmission);

    const backup = parseEntities.then(entities =>
      disatransform.buildLabXForm(
        entities.sampleIds, entities.statusDate, entities.changes
      )
    )
    .tap(xform => log.info('Built lab status xform', xform))
    .then(aggregate.makeSubmission)
    .spread((odkRes, body) => {
      const resMessage = `${odkRes.statusCode} - ${odkRes.statusMessage}`;
      if (odkRes.statusCode === 201 || odkRes.statusCode === 202) {
        log.info(`Successful ODK lab status submission: ${resMessage}`);
      } else {
        log.error(`Error with ODK lab status submission: ${resMessage}`);
      }
      return body;
    })
    .catch(err => {
      log.error(`Aggregate submission failed - ${err.message}\n${err.stack}`);
    });

    return BPromise.join(saveSubmission, backup, (results, odkBody) => {
      log.debug(`Finished saving lab submission: ${results}`);
      log.debug(`ODK Aggregate submission response: ${odkBody}`);
      // TODO: maybe send a meaningful message
      res.status(201).send(SUBMISSION_SUCCESS);
    })
    .catch(err => {
      log.error(err);
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
