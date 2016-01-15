'use strict';

const express = require('express');
const router = express.Router();
const BPromise = require('bluebird');
const formidable = require('formidable');
const config = require('app/config');
const log = require('app/server/util/log.js');
const sttmiddleware = require('app/server/sttmiddleware.js');
const aggregate = require('app/server/odk/aggregateapi.js');

function prepareXMLResponse(res, statusCode, body) {
  res.set({
    'Content-Type': 'text/xml',
    'Content-Length': body.length
  });
  res.status(statusCode);
}

router.all('*', aggregate.setOpenRosaHeaders);

function setOpenRosaAcceptLenghtHeaders(req, res, next) {
  log.debug('Setting X-OpenRosa-Accept-Content-Length header');
  res.append('X-OpenRosa-Accept-Content-Length', '10485760');
  next();
}

function handleHeadRequest(req, res) {
  res.status(200).send();
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function swapHostnames(xml, fromHost, toHost) {
  return new BPromise((resolve) => {
    resolve(xml.replace(new RegExp(escapeRegExp(fromHost), 'g'), toHost));
  });
}

const ODK_MASK_HOST = config.server.HOSTNAME + '/odk';

router.head('/formList', handleHeadRequest);
router.get('/formList',
  aggregate.setOpenRosaHeaders,
  sttmiddleware.normalizeParams,
  (req, res) => {
    var formId = req.query.formid;
    var verbose = req.query.verbose;
    var allVersions = req.query.listallversions;

    return aggregate.formList({formId, verbose, allVersions})
    .spread((odkRes, body) => {
      return BPromise.join(
        odkRes,
        swapHostnames(body, config.odk.aggregate.HOST, ODK_MASK_HOST)
      );
    })
    .spread((odkRes, body) => {
      log.debug('Got formList', body);
      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    });
  }
);

router.head('view/submissionList',
  setOpenRosaAcceptLenghtHeaders,
  handleHeadRequest
);

router.get('/view/submissionList',
  setOpenRosaAcceptLenghtHeaders,
  sttmiddleware.normalizeParams,
  (req, res, next) => {
    log.debug('SUBMISSION LIST with body', req.body);

    var formId = req.query.formid;
    var numEntries = req.query.numentries;
    var cursor = req.query.cursor;
    if (typeof formId !== 'undefined') {
      return aggregate.submissionList({formId, numEntries, cursor})
      .spread((odkRes, body) => {
        log.debug('Got submissionList', body);

        prepareXMLResponse(res, odkRes.statusCode, body);
        res.send(body);
      })
      .catch(err => next(err));
    } else {
      res.status(500).json({'error': 'Missing formid parameter'});
    }
  }
);

router.head('/view/downloadSubmission', handleHeadRequest);
router.get('/view/downloadSubmission',
  sttmiddleware.normalizeParams,
  (req, res, next) => {
    var formId = req.query.formid;
    var topElement = req.query.topelement || formId;
    var submissionId = (
      req.query.submissionid ||
      req.query.idvalue ||
      req.query.instanceid
    );

    aggregate.downloadSubmission({formId, topElement, submissionId})
    .spread((odkRes, body) => {
      log.debug('Got downloadSubmission', body);

      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    })
    .catch(err => next(err));
  }
);

const SUBMISSION_PART_NAME = 'xml_submission_file';

function handleSubmissionPart(form, part) {
  if (part.name !== SUBMISSION_PART_NAME) {
    log.debug('formidable handling part.name=%s', part.name);
    form.handlePart(part);
    return;
  }

  log.debug('handling ODK XML submission');
  var value = '';
  part.on('data', function(buff) {
    value += buff.toString('utf-8');
  });

  part.on('end', function() {
    form.emit('field', part.name, value);
  });
}

function parseSubmissionFormData(req, res, next) {
  log.debug('parseSubmissionFormData');
  const form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }
    req.form = {fields, files};
    next();
  });

  form.onPart = handleSubmissionPart.bind(null, form);
}

// Responses to the /submission route with status code `200` are not considered
// successful. For this reason, the submission route requires a custom status
// code of `204` sent with its response
// https://groups.google.com/d/msg/opendatakit-developers/PFWsIb3nnTk/e4DyVsWCnZYJ
router.head('/submission',
  setOpenRosaAcceptLenghtHeaders,
  (req, res) => res.status(204).send()
);

router.post('/submission',
  setOpenRosaAcceptLenghtHeaders,
  parseSubmissionFormData,
  (req, res) => {
    log.debug('Received new ODK form submission, body=%s', req.body);
    log.debug('ODK form submission formData=%s', req.form);

    return aggregate.makeSubmission(req.form.fields[SUBMISSION_PART_NAME])
    .spread((odkRes, body) => {
      log.debug('Got submission response with statusCode=%s',
        odkRes.statusCode, body);

      prepareXMLResponse(res, odkRes.statusCode, body);
      res.send(body);
    });
  }
);

function handlePassthroughGet(req, res, next) {
  log.debug('%s, query:', req.originalUrl, req.query);
  return aggregate.passthroughGet({url: req.path, query: req.query})
  .spread((odkRes, body) => BPromise.join(
    odkRes,
    swapHostnames(body, config.odk.aggregate.HOST, ODK_MASK_HOST)
  ))
  .spread((odkRes, body) => {
    log.debug('Got passthroughGet response', body);

    prepareXMLResponse(res, odkRes.statusCode, body);
    res.send(body);
  })
  .catch(err => next(err));
}

router.head('/xformsManifest', handleHeadRequest);
router.get('/xformsManifest', handlePassthroughGet);

router.head('/formXml', handleHeadRequest);
router.get('/formXml', handlePassthroughGet);

router.head('/xformsDownload', handleHeadRequest);
router.get('/xformsDownload', handlePassthroughGet);

router.all('/*', (req, res, next) => {
  var error = new Error('Not allowed');
  error.status = 405;
  next(error);
});

module.exports = router;
