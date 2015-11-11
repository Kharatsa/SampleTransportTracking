'use strict';

const express = require('express');
const router = express.Router();
const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateapi.js');

function sendXML(res, xml) {
  res.set({
      'Content-Type': 'text/xml',
      'Content-Length': xml.length
    });
  res.send(xml);
}

// Convert query parameters to lowercase
const normalizeParams = function(req, res, next) {
  var result = {};
  log.debug('Query parameters before normalization:', req.query);
  if (req.query) {
    Object.keys(req.query).forEach(function(key) {
      result[key.toLowerCase()] = req.query[key];
    });
    req.query = result;
  }
  log.debug('Query parameters after normalization:', req.query);
  next();
};

router.get('/formlist', function(req, res) {
  log.debug('ODK formList');
  aggregate.formList()
  .spread(function(listRes, listBody) {
    sendXML(res, listBody);
  });
});

router.get('/view/submissionList', function(req, res) {
  log.debug('ODK submissionList\n\tformId=%s\n\tnumEntries=%s',
    req.query.formId, req.query.numEntries);
  var formId = req.query.formid;
  var numEntries = req.query.numentries;
  if (formId) {
    aggregate.submissionList(formId, numEntries)
    .spread(function(listRes, listBody) {
      sendXML(res, listBody);
    });
  }
});

router.get('/view/downloadSubmission', normalizeParams, function(req, res) {
  log.debug('downloadSubmission query');
  console.dir(req.query);

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
