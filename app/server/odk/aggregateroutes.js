'use strict';

const express = require('express');
const router = express.Router();
const normalizeParams = require('app/server/middleware.js').normalizeParams;
const aggregate = require('app/server/odk/aggregateapi.js');

function sendXML(res, odkRes, xml) {
  res.set({
    'Content-Type': 'text/xml',
    'Content-Length': xml.length
  });
  res.status(odkRes.statusCode);
  res.send(xml);
}

router.get('/formlist', function(req, res) {
  aggregate.formList()
  .spread(function(odkRes, body) {
    sendXML(res, odkRes, body);
  });
});

router.get('/view/submissionList', normalizeParams, function(req, res) {
  var formId = req.query.formid;
  var numEntries = req.query.numentries;
  var cursor = req.query.cursor;
  if (typeof formId !== 'undefined') {
    return aggregate.submissionList(formId, numEntries, cursor)
    .spread(function(odkRes, body) {
      sendXML(res, odkRes, body);
    });
  } else {
    res.status(500).json({'error': 'Missing formid parameter'});
  }
});

router.get('/view/downloadSubmission', normalizeParams, function(req, res) {
  var formId = req.query.formid;
  var topElement = req.query.topelement || formId;
  var submissionId = (
    req.query.submissionid ||
    req.query.idvalue ||
    req.query.instanceid
  );

  aggregate.downloadSubmission(formId, topElement, submissionId)
  .spread(function(odkRes, body) {
    sendXML(res, odkRes, body);
  });
});

module.exports = router;
