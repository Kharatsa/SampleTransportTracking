#!/usr/bin/env node --harmony

'use strict';

const config = require('app/config');
const log = require('app/server/util/log.js');
const sttModels = require('app/server/stt/models');
const storage = require('app/server/storage');
storage.init({config: config.db});
Object.keys(sttModels).forEach(modelName =>
  storage.loadModel(sttModels[modelName])
);
const sttclient = require('app/server/stt/sttclient.js');
const client = sttclient.create({db: storage.db, models: storage.models});
const aggregatesync = require('app/server/odk/sync/aggregatesync.js');

const cli = require('commander');

function purge() {
  log.info('Purging database');

  return client.db.dropAllSchemas()
  .then(() => client.db.sync())
  .then(() => log.info('Finished purging database'));
}

cli
  .command('purge')
  .description('purge the local database')
  .action(purge);

function sync() {
  log.info('Re-syncing the local database');

  return client.db.sync()
  .then(() => client.models.Forms.truncate())
  .then(() => log.info('Finished Forms truncate'))
  .then(() => aggregatesync.syncFormList())
  .then(forms => log.info('Finished synchronizing forms', forms));
}

cli
  .command('sync')
  .description('purge the database, and reload from odk aggregate')
  .action(sync);

cli.parse(process.argv);
