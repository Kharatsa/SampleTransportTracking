'use strict';

const express = require('express');
const config = require('app/config.js');
const log = require('app/server/util/log.js');
const DBStorage = require('app/server/datastorage.js');
const handleShutdown = require('app/server/util/shutdown.js');
const PublishClient = require('app/server/odk/publishclient.js');
const aggregateRoutes = require('app/server/odk/aggregateroutes.js');
const publisherRoutes = require('app/server/odk/publishroutes.js');

var app = exports.app = express();

var dbStorage = exports.dbStorage = new DBStorage(
  {storage: config.sqliteFilename}
);

var publishClient;
dbStorage.once('ready', function() {
  log.debug('sqlite DB ready');
  publishClient = exports.publishClient = new PublishClient(dbStorage);
});

handleShutdown();

app.use('/odk', aggregateRoutes);
app.use('/publish', publisherRoutes);

app.get('/', function(req, res) {
  log.debug('Home route', req.originalUrl);
  res.status(200).send('TODO');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    log.error('Request DEV Error', err, err.stack);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  log.error('Request Error', err, err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

app.listen(config.portNumber, function() {
  log.info('Server listening on port', config.portNumber);
});
