'use strict';

const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const requestLog = require('app/server/util/logrequest.js');
const storage = require('app/server/storage');
storage.init({config: config.db});
const metamodels = require('app/server/stt/models/metadata');
const sttmodels = require('app/server/stt/models');
const authmodels = require('app/server/auth/models');
storage.loadModels(authmodels);
storage.loadModels(metamodels);
storage.loadModels(sttmodels);
const sttmiddleware = require('app/server/sttmiddleware.js');
const shutdownhandler = require('app/server/util/shutdownhandler.js');
const AggregateRoutes = require('app/server/odk/aggregateroutes.js');
const STTRoutes = require('app/server/stt/sttroutes.js');
const DisaRoutes = require('app/server/disa/disaroutes.js');
const prepareserver = require('app/server/prepareserver.js');

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

prepareserver()
.then(() => log.info('Finished server preload'));

app.use(sttmiddleware.handleErrors);

app.listen(config.server.LISTEN_PORT, config.server.LISTEN_HOST, () =>
  log.info('Listening at ' + config.server.LISTEN_HOST +
    ':' + config.server.LISTEN_PORT)
);

module.exports = app;
