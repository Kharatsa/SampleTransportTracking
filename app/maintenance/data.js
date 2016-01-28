#!/usr/bin/env node --harmony

'use strict';

const BPromise = require('bluebird');
const config = require('app/config');
const log = require('app/server/util/logapp.js');
const authmodels = require('app/server/auth/models');
const sttmodels = require('app/server/stt/models');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');
const cli = require('commander');

var client;

function before() {
  storage.init({config: config.db});
  storage.loadModels(authmodels);
  storage.loadModels(sttmodels);
  storage.db.sync();
  client = sttclient({db: storage.db, models: storage.models});
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

function rebuild() {
  log.info('Rebuilding the local database');
  before();

  const aggregatesync = require('app/server/odk/sync/aggregatesync.js');

  return purge()
  .then(() => aggregatesync.getFormList())
  .then(parsed => client.saveForms(parsed))
  .tap(forms => log.info('Finished synchronizing forms', forms))
  .map(form => form.get('form_id'))
  .map(formId => (
    BPromise.props({formId, ids: aggregatesync.getAllSubmissionIds(formId)})
  ))
  .tap(results => log.info('Finished fetching submission ids', results))
  .map(formSubs =>
    BPromise.map(formSubs.ids, id =>
      aggregatesync.getSubmission(formSubs.formId, id)
  ));
}

cli.command('rebuild')
  .description('purge the database, and reload from odk aggregate')
  .action(rebuild);

cli.parse(process.argv);
