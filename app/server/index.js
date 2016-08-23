'use strict';

// for better require()s
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../app'));
require('app-module-path').addPath(path.join(__dirname, '../../test'));

const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const config = require('config');
const log = require('server/util/logapp.js');
const requestLog = require('server/util/logrequest.js');
const storage = require('server/storage');
storage.init({config: config.db});
const metamodels = require('server/stt/models/metadata');
const sttmodels = require('server/stt/models');
const authmodels = require('server/auth/models');
storage.loadModels(metamodels);
storage.loadModels(sttmodels);
storage.loadModels(authmodels);
const errors = require('server/middleware/errors.js');
const shutdownhandler = require('server/util/shutdownhandler.js');
const AggregateRoutes = require('server/odk/aggregateroutes.js');
const STTRoutes = require('server/stt/sttroutes.js');
const DisaRoutes = require('server/disa/disaroutes.js');
const prepareserver = require('server/prepareserver.js');

shutdownhandler.init();

const app = express();

log.info('NODE_ENV=%s', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  log.info('Running PRODUCTION server');
  app.set('trust proxy', 'loopback'); // specify a single subnet
} else {
  log.info('Running DEVELOPMENT server');
  app.set('json spaces', 2);
}

const passport = require('server/auth/httpauth.js');
const authenticate = passport.authenticate('basic', {session: false});

if (config.server.AUTH_ENABLED && process.env.NODE_ENV === 'production') {
  log.info('Enabled required authentication on all routes');
  app.all('*', authenticate);
} else {
  log.warn('Authentication disabled on all routes');
}

app.use(express.static(config.server.PUBLIC_PATH));
log.info('Serving static files from', config.server.PUBLIC_PATH);
app.use(favicon(config.server.PUBLIC_PATH + '/favicon.ico'));
app.use(helmet());

app.use(requestLog.requestLogger);

// App routes
app.use('/odk', AggregateRoutes);
app.use('/stt', STTRoutes);
app.use('/disa', DisaRoutes);

app.get('/*', (req, res) => {
  res.sendFile(`${config.server.PUBLIC_PATH}/index.html`);
});

if (process.env.NODE_ENV === 'development') {
  const fakedata = require('utils/fakedata.js');
  prepareserver()
  .then(() => fakedata.load())
  .catch(err => log.error(err, err.message))
  .then(() => log.info('Finished server preload'));
}

app.use(errors.handleErrors);

app.listen(config.server.LISTEN_PORT, config.server.LISTEN_HOST, () =>
  log.info('Listening at ' + config.server.LISTEN_HOST +
    ':' + config.server.LISTEN_PORT)
);

module.exports = app;
