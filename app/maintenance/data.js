#!/usr/bin/env node --harmony

'use strict';

const config = require('app/config');
const log = require('app/server/util/logapp.js');
const authmodels = require('app/server/auth/models');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
const cli = require('commander');

function before() {
  storage.init({config: config.db});
  storage.loadModels(authmodels);
  storage.loadModels(sttmodels);
}

function purge() {
  log.info('Purging database');
  before();

  return storage.db.dropAllSchemas()
  .then(() => storage.db.sync())
  .then(() => log.info('Finished purging database'));
}

cli.command('purge')
  .description('purge the local database')
  .action(purge);

function sync() {
  log.info('Syncing the local database');
  before();
  return storage.db.sync();
}

cli.command('sync')
  .description('sync the database tables')
  .action(sync);

cli.parse(process.argv);
