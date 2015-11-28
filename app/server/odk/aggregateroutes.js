'use strict';

const express = require('express');
const router = express.Router();
const log = require('app/server/util/log.js');
const normalizeParams = require('app/server/middleware.js').normalizeParams;
const aggregate = require('app/server/odk/aggregateapi.js');

function sendXML(res, xml) {
  res.set({
    'Content-Type': 'text/xml',
    'Content-Length': xml.length
  });
  res.send(xml);
}

router.get('/formlist', function(req, res) {
  log.debug('ODK formList');
  aggregate.formList()
  .spread(function(listRes, listBody) {
    sendXML(res, listBody);
  });
});

router.get('/view/submissionList', normalizeParams, function(req, res) {
  log.debug('ODK submissionList\n\tformId=%s\n\tnumEntries=%s',
    req.query.formId, req.query.numEntries);
  var formId = req.query.formid;
  var numEntries = req.query.numentries;
  log.debug('formId', formId);
  if (typeof formId != 'undefined') {
    return aggregate.submissionList(formId, numEntries)
    .spread(function(listRes, listBody) {
      sendXML(res, listBody);
    });
  } else {
    res.status(500).json({'error': 'Missing formid parameter'});
  }
});

router.get('/view/downloadSubmission', normalizeParams, function(req, res) {
  log.debug('downloadSubmission query');

  var formId = req.query.formid;
  var topElement = req.query.topelement || formId;
  var submissionId = (
    req.query.submissionid ||
    req.query.idvalue ||
    req.query.instanceid
  );
  log.info('ODK downloadSubmission\n\tformId=%s\n\ttopElement=%s' +
    '\n\tsubmissionId=%s', formId, topElement, submissionId);

  aggregate.downloadSubmission(formId, topElement, submissionId)
  .spread(function(subRes, subBody) {
    sendXML(res, subBody);
  });
});

module.exports = router;
