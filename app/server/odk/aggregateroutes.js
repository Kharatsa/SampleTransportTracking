'use strict';

const express = require('express');
const router = express.Router();
const aggregate = require('app/server/odk/aggregateapi.js');

function sendXML(res, xml) {
  res.set({
      'Content-Type': 'text/xml',
      'Content-Length': xml.length
    });
  res.send(xml);
}

router.get('/formlist', function(req, res) {
  aggregate.formList()
  .then(function(body) {
    sendXML(res, body);
  });
});

router.get('/view/submissionList', function(req, res) {
  aggregate.submissionList(req.query.formId, req.query.numEntries)
  .then(function(body) {
    sendXML(res, body);
  });
});

router.get('/view/downloadSubmission', function(req, res) {
  aggregate.downloadSubmission(req.query.formid, req.query.idvalue)
  .then(function(body) {
    sendXML(res, body);
  });
});

module.exports = router;
