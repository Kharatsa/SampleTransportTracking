'use strict';

const express = require('express');
const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateroutes.js');

var app = express();

app.use('/odk', aggregate);

app.all('*', function(req, res) {
  log.debug('Catchall', req.originalUrl);
  res.send('TODO');
});

app.listen(8081, function() {
  log.info('Server listening on port', 8081);
});
