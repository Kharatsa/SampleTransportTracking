'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const transform = require('server/disa/disatransform.js');
const disasubmission = require('server/disa/disasubmission.js');
const aggregatesubmission = require('server/odk/aggregatesubmission.js');

// Disable HTTP authentication during development
let passport = null;
let authenticate = null;
if (process.env.NODE_ENV === 'production') {
  passport = require('server/auth/httpauth.js');
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

// Reports whether or not synced indicates the local DB was altered
const databaseUpdated = BPromise.method(synced =>
  Object.keys(synced).some(key => {
    const entity = synced[key];
    if (entity && entity.inserted.length || entity.updated.length) {
      return true;
    }
    return false;
  }));

const backupToODK = (entities, requestDate, xml) => (
  transform.buildLabXForm(
    entities.sampleIds,
    entities.statusDate,
    entities.changes,
    entities.metaFacility,
    requestDate,
    xml
  ))
  .tap(xform => log.info('Built Lab Status XForm', xform))
  .then(aggregatesubmission.submit);

router.post('/status',
  authenticate,
  requireXML,
  textParser,
  requireBody,
  (req, res, next) => {
    log.info('Received Disa Labs status\n\t', req.body);
    const requestDate = new Date();
    const xml = req.body;

    const parseXML = transform.labStatus(xml);

    const parseEntities = parseXML.then(parsed =>
      BPromise.props({
        sampleIds: transform.sampleId(parsed),
        statusDate: transform.labStatusDate(parsed),
        labTests: transform.labTests(parsed),
        changes: transform.labChanges(parsed),
        metaStatuses: transform.metaStatuses(parsed),
        metaFacility: transform.metaFacility(parsed),
        metaLabTests: transform.metaLabTests(parsed),
        metaRejections: transform.metaRejections(parsed)
      })
    )
    .tap(log.info);

    const saveSubmission = parseEntities.then(disasubmission.handleSubmission)
    .tap(log.debug);

    // Only communicate with ODK when the local database changed
    const maybeBackup = BPromise.join(
      parseEntities, saveSubmission, (parsed, synced) => {
        return databaseUpdated(synced)
        .then(updated => {
          if (updated) {
            return backupToODK(parsed, requestDate, xml);
          }
          return null;
        });
      });

    return BPromise.join(saveSubmission, maybeBackup, (results, odkBody) => {
      log.info('Finished saving lab submission & ODK backup');
      if (odkBody) {
        log.info(`ODK Aggregate submission response: ${odkBody}`);
      } else {
        log.info('Skipped ODK Aggregate backup');
      }
      // TODO: maybe send a meaningful message body
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
