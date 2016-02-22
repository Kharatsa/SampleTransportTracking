'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const disatransform = require('app/server/disa/disatransform.js');
const disasubmission = require('app/server/disa/disasubmission.js');
const aggregatesubmission = require('app/server/odk/aggregatesubmission.js');
const aggregate = require('app/server/odk/aggregateapi.js');

let passport = null;
let authenticate = null;
if (process.env.NODE_ENV === 'production') {
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
    const requestDate = new Date();
    const xml = req.body;

    const parseXML = disatransform.labStatus(xml);

    const parseEntities = parseXML.then(parsed =>
      BPromise.props({
        facility: disatransform.facility(parsed),
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
        entities.sampleIds,
        entities.statusDate,
        entities.changes,
        entities.facility,
        requestDate,
        xml
      )
    )
    .tap(xform => log.info('Built lab status xform', xform))
    .then(aggregatesubmission.submit)
    .then(aggregate.makeSubmission);

    return BPromise.join(saveSubmission, backup, (results, odkBody) => {
      log.info('Finished saving lab submission & ODK backup');
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
