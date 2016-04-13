#!/usr/bin/env node

'use strict';

// for better require()s
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../app'));

const cli = require('commander');
const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const authModels = require('server/auth/models');
const authclient = require('server/auth/authclient.js');
const credentials = require('server/auth/credentials.js');
const clibefore = require('./utils/clibefore.js');
const clireport = require('./utils/clireport.js');

const before = clibefore({models: authModels});

// Global options
cli.option('-d --development', 'Run commands on development database ' +
           '(default: production');

// const usersBefore = before.bind(null, authModels);

const makeAuthClient = storage => (
  authclient({db: storage.db, models: storage.models}));

const displayUsersTable = users => {
  const Table = require('cli-table');
  const table = new Table({
    head: ['ID', 'Username', 'Admin', 'Created At', 'Updated At'],
    colWidths: [5, 20, 10, 28, 28]
  });

  return BPromise.map(users, user => [
    user.id,
    user.username,
    user.isAdmin,
    user.createdAt,
    user.updatedAt
  ])
  .each(user => table.push(user))
  .then(() => console.log(table.toString()));
};

const validUser = user => {
  return (
    user !== null &&
    typeof user !== 'undefined' &&
    typeof user.id !== 'undefined'
  );
};

const list = () => {
  return before({dev: cli.development})
  .then(makeAuthClient)
  .then(client => client.all())
  .then(displayUsersTable);
};

cli.command('list')
  .description('List all users in the database')
  .action(list);

const handleUserResult = (client, user, username, password, isAdmin) => {
  if (!validUser(user)) {
    log.info('Inserting new user in database');

    return credentials.protect(password)
    .then(result => client.createUser({
      username, salt: result.salt, digest: result.digest, isAdmin
    }))
    .then(user => {
      log.info('Successfully created new user');
      displayUsersTable([user]);
    });
  }

  log.error(`User with username="${username}" already exists`);
};

/**
 * Adds a new user to the STT database
 *
 * @param  {!string} username [description]
 * @param  {!string} password [description]
 * @param  {?Object} options  [description]
 * @param {?boolean} options.admin [description]
 */
const add = (username, password, options) => {
  username = username.trim();
  password = password.trim();
  const isAdmin = !!options.admin;
  log.debug(`User add
        username=${username}
        password=${password}
        (admin=${isAdmin})`);

  const getClient = before({dev: cli.development}).then(makeAuthClient);
  const getUser = getClient.then(client => client.getUser({username}));
  return BPromise.join(getClient, getUser, (client, user) =>
    handleUserResult(client, user, username, password, isAdmin)
  );
};

cli.command('add <username> <password>')
  .description('Add a new user')
  .option('-a, --admin', 'Add user as administrator')
  .action(add);

/**
 * Removes a user from the STT database
 *
 * @param  {string} username [description]
 */
const remove = username => {
  username = username.trim().toUpperCase();
  log.debug(`User remove
      username=${username}`);

  // return usersBefore(cli.development)
  return before({dev: cli.development})
  .then(makeAuthClient)
  .then(client => client.removeUser({username}))
  .then(count =>
    clireport.handleRemoveResult(count, 'user', 'username', username));
};

cli.command('remove <username>')
  .description('Remove an existing user')
  .action(remove);

const handlePasswordChange = (client, user, username, password) => {
  if (validUser(user)) {
    log.info('Changing user\'s password');

    return credentials.protect(password)
    .then(result => client.changePassword({
      username, salt: result.salt, digest: result.digest
    }))
    .then(user => {
      log.info('Successfully updated password for user');
      displayUsersTable([user]);
    });
  }

  log.error(`Failed locate User with username=${username}.`);
};

const changePassword = (username, newPassword) => {
  username = username.trim();
  newPassword = newPassword.trim();

  log.debug(`User change password
        username=${username}
        password=${newPassword})`);

  // const getClient = usersBefore(cli.development);
  const getClient = before({dev: cli.development}).then(makeAuthClient);
  const getUser = getClient.then(client => client.getUser({username}));
  return BPromise.join(getClient, getUser, (client, user) =>
    handlePasswordChange(client, user, username, newPassword)
  );
};

cli.command('changepwd <username> <newPassword>')
  .description('Change an existing user\'s password')
  .action(changePassword);

// TODO: Load users from secret CSV or JSON

cli.parse(process.argv);
