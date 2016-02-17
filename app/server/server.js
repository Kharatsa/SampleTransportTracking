'use strict';

const express = require('express');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const requestLog = require('app/server/util/logrequest.js');
const storage = require('app/server/storage');
storage.init({config: config.db});
const sttmodels = require('app/server/stt/models');
const authmodels = require('app/server/auth/models');
storage.loadModels(authmodels);
storage.loadModels(sttmodels);
const preload = require('app/server/storage/preload.js');
const sttmiddleware = require('app/server/sttmiddleware.js');
const shutdownhandler = require('app/server/util/shutdownhandler.js');
const AggregateRoutes = require('app/server/odk/aggregateroutes.js');
const STTRoutes = require('app/server/stt/sttroutes.js');
const DisaRoutes = require('app/server/disa/disaroutes.js');
const fakedata = require('../../test/data/fakedata.js');

shutdownhandler.init();

const app = express();

log.info('NODE_ENV=%s', process.env.NODE_ENV);
if (config.server.isProduction()) {
  log.info('Running PRODUCTION server');
  app.set('trust proxy', 'loopback'); // specify a single subnet
} else {
  log.info('Running DEVELOPMENT server');
  app.set('json spaces', 2);
}

const preloadMetadata = storage.db.sync()
.then(() => [
  {filename: 'riders.csv', type: 'person', key: 'rider_key', value: 'rider'},
  {filename: 'conditions.csv', type: 'status', key: 'cond_key', value: 'cond'},
  {filename: 'regions.csv', type: 'region', key: 'region_key', value: 'region'},
  {filename: 'stypes.csv', type: 'artifact', key: 'stype_key', value: 'stype'}
])
.mapSeries(preload.metadata)
.then(() => log.info('Metadata preload completed'))
.catch(err => log.error(err, err.stack));

if (process.env.NODE_ENV !== 'production') {
  // TODO: remove when facilities list is completed
  const preloadTestMetadata = preloadMetadata.then(() =>
    preload.metadata({
      filename: 'facilities.csv',
      type: 'facility',
      key: 'facility_key',
      value: 'facility'
    })
  );

  preloadTestMetadata.then(() => fakedata.load());
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

// app.use(requestLog.errorLogger);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   var err = new Error('Not Found ' + req.originalUrl);
//   err.status = 404;
//   next(err);
// });

app.use(sttmiddleware.handleErrors);

app.listen(config.server.LISTEN_PORT, config.server.LISTEN_HOST, () =>
  log.info('Listening at ' + config.server.LISTEN_HOST +
    ':' + config.server.LISTEN_PORT)
);

module.exports = app;
