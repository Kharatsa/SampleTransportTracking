'use strict';

const BPromise = require('bluebird');
const storage = require('app/server/storage');
const log = require('app/server/util/logapp.js');

const beforeDefaults = options => {
  let models = options.models;
  let dev = options.dev;
  return (options) => {
    models = options.models || models;
    dev = options.dev || dev;
    if (dev) {
      log.debug('Applying commands to development database');
    } else {
      log.debug('Applying commands to production database');
      process.env.NODE_ENV = 'production';
    }

    const config = require('app/config');
    const dbConfig = Object.assign({}, config.db, {logging: false});

    return BPromise.resolve()
    .then(() => storage.init({config: dbConfig}))
    .then(() => storage.loadModels(models))
    .then(() => storage.db.sync())
    .then(() => (storage));
  };
};

module.exports = beforeDefaults;
