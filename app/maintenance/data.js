#!/usr/bin/env node --harmony

'use strict';

const config = require('app/config');
const log = require('app/server/util/log.js');
const sttModels = require('app/server/stt/models');
const authModels = require('app/server/auth/models');
const storage = require('app/server/storage');
storage.init({config: config.db});
Object.keys(sttModels).forEach(modelName =>
  storage.loadModel(sttModels[modelName])
);
Object.keys(authModels).forEach(modelName =>
  storage.loadModel(authModels[modelName])
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
  log.info('Syncing the local database');

  return client.db.sync();
}

cli
  .command('sync')
  .description('sync the database tables')
  .action(sync);

function rebuild() {
  log.info('Rebuilding the local database');

  return client.db.sync()
  .then(() => client.models.Forms.truncate())
  .then(() => log.info('Finished Forms truncate'))
  .then(() => aggregatesync.syncFormList())
  .then(forms => log.info('Finished synchronizing forms', forms));
}

cli
  .command('rebuild')
  .description('purge the database, and reload from odk aggregate')
  .action(rebuild);

cli.parse(process.argv);
