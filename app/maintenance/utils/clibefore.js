'use strict';

const BPromise = require('bluebird');
const storage = require('server/storage');
const log = require('server/util/logapp.js');

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

    const config = require('config');
    // Turn off detailed query logging when running CLI scripts
    const dbConfig = Object.assign({}, config.db, {logging: false});

    return BPromise.resolve()
    .then(() => storage.init({config: dbConfig}))
    .then(() => {
      if (Array.isArray(models)) {
        return models.forEach(m => storage.loadModels(m));
      }
      return storage.loadModels(models);
    })
    .then(() => storage.db.sync())
    .then(() => (storage));
  };
};

module.exports = beforeDefaults;
