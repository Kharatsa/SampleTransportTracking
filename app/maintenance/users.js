#!/usr/bin/env node --harmony

'use strict';

const config = require('app/config');
const log = require('app/server/util/log.js');
const storage = require('app/server/storage');
const authModels = require('app/server/auth/models');
const authclient = require('app/server/auth/authclient.js');
const credentials = require('app/server/auth/credentials.js');
const cli = require('commander');

var client;

function before() {
  storage.init({config: config.db});
  storage.loadModel(authModels.users);
  client = authclient.create({db: storage.db, models: storage.models});
}

/**
 * Adds a new user to the STT database
 *
 * @param  {!string} username [description]
 * @param  {!string} password [description]
 * @param  {?Object} options  [description]
 * @param {?boolean} options.admin [description]
 */
function add(username, password, options) {
  before();

  username = username.trim();
  password = password.trim();
  var admin = !!options.admin;
  log.debug('User Add -- username=`%s`, password=`%s` (admin=%s)',
            username, password, !!options.admin);
  return client.getUser({username})
  .then(user => {
    if (!user || Object.keys(user).length === 0) {
      log.info('User should be created');
      return credentials.protect(password)
      .then(result => client.createUser({
        username, salt: result.salt, digest: result.digest, admin
      }))
      .then(user => log.info('New user created', user));
    }
    log.warn('User with username ' + username + ' already exists', user);
  });
}

cli.command('add <username> <password>')
  .description('add a new user')
  .option('-a, --admin', 'add user as administrator')
  .action(add);

/**
 * Removes a user from the STT database
 *
 * @param  {string} username [description]
 */
function remove(username) {
  before();

  username = username.trim();

  log.debug('User Remove -- username=%s', username);

  return client.removeUser({username: username})
  .then(deleted => {
    if (deleted) {
      log.info('Successfully deleted %s user record(s)', deleted);
    } else {
      log.warn('Could not delete username=%s', username);
    }
  });
}

cli.command('remove <username>')
  .description('remove an existing user')
  .action(remove);

// TODO: List existing users
// TODO: Change user's password
// TODO: Maybe rehash passwords?
// TODO: Load users from secret CSV or JSON

cli.parse(process.argv);
