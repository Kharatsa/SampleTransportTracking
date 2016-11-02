#!/usr/bin/env node

'use strict';

// for better require()s
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../app'));


const log = require('server/util/logapp.js');
const authmodels = require('server/auth/models');
const metamodels = require('server/stt/models/metadata');
const sttmodels = require('server/stt/models');
const storage = require('server/storage');
const cli = require('commander');

cli.option('-d --development', 'Run commands on development database ' +
           '(default: production');

function before() {
  if (cli.development) {
    log.debug('Applying commands to development database');
  } else {
    log.debug('Applying commands to production database');
    process.env.NODE_ENV = 'production';
  }

  const config = require('config');

  storage.init({config: config.db});
  storage.loadModels(authmodels);
  storage.loadModels(metamodels);
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
