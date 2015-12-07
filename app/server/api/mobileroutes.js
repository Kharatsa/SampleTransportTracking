'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const log = require('app/server/util/log.js');
const handleJSONErrors = require('app/server/middleware.js').handleJSONErrors;

// parse application/json
const jsonParser = bodyParser.json();
// Funnel body-parser errors into the application log
router.use(handleJSONErrors);

router.post('/upload', jsonParser, function(req, res) {
  res.json(req.body);
});

module.exports = router;
