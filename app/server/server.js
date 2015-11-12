'use strict';

const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const config = require('app/config.js');
const log = require('app/server/util/log.js');
const requestLog = require('app/server/util/logrequest.js');
const DBStorage = require('app/server/storage/datastorage.js');
const handleShutdown = require('app/server/util/shutdown.js');
const aggregateRoutes = require('app/server/odk/aggregateroutes.js');
const PublishClient = require('app/server/odk/publishclient.js');
const publishRoutes = require('app/server/odk/publishroutes.js');
const SampleTracker = require('app/server/api/trackerapi.js');
const trackerRoutes = require('app/server/api/trackerroutes.js');

var app = exports.app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(helmet());
if (config.isProduction) {
  log.info('Running PRODUCTION server');
  app.set('trust proxy', 'loopback'); // specify a single subnet
} else {
  log.info('Running DEVELOPMENT server');
  app.set('json spaces', 2);
}
app.use(requestLog.requestLogger);

var dbStorage = exports.dbStorage = new DBStorage(
  {storage: config.sqliteFilename}
);

var publishClient;
var sampleTracker;
dbStorage.once('ready', function() {
  log.info('Database connection established');
  publishClient = exports.publishClient = new PublishClient(dbStorage);
  sampleTracker = exports.sampleTracker = new SampleTracker(dbStorage);
});

// Pass handleShutdown any functions to execute on shutdown (e.g., close DB
// connections)
handleShutdown();

app.use('/odk', aggregateRoutes);
app.use('/publish', publishRoutes);
app.use('/track', trackerRoutes);

app.get('/', function(req, res) {
  res.status(200).send('TODO');
});

app.use(requestLog.errorLogger);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found ' + req.originalUrl);
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (config.isProduction) {
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
