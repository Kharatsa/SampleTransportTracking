'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const datadb = require('app/server/util/datadb.js');

/**
 * [AuthClient description]
 * @param {!Object} options [description]
 * @param {!Database} options.db [description]
 * @param {!Object} options.models [description]
 * @param {!Sequelize.Model} options.models.Users [description]
 */
function AuthClient(options) {
  log.debug('Creating STTClient');

  if (!options.db) {
    throw new Error('Database is a required parameter');
  }
  this.db = options.db;

  if (!options.models.Users) {
    throw new Error('Users model is a required parameter');
  }
  this.models = options.models;
}

/**
 * Returns a copy of username converted to lowercase, and with special
 * characters removed.
 *
 * @method
 * @param  {string} username [description]
 * @return {Promise.<string>}
 */
var sanitizeUsername = BPromise.method(function(username) {
  return username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
});

const USERNAME_MAX_LENGTH = 50;

/**
 * [getUser description]
 *
 * @method
 * @param  {!Object} options [description]
 * @param {!string} username [description]
 * @param {?bool} [simple=true] [description]
 * @return {Promise.<Sequelize.Instance|Object>}
 * @throws {Error} If [!options.username]
 */
AuthClient.prototype.getUser = BPromise.method(function(options) {
  options = _.defaultsDeep(options || {}, {
    simple: true
  });

  var username = options.username;
  log.debug('getUser for username:', username);
  if (!username) {
    throw new Error('getUser requires options.username');
  }

  return sanitizeUsername(username)
  .bind(this)
  .then(username => this.models.Users.findOne({where: {username}}))
  .then(result => {
    if (options.simple) {
      return datadb.makePlain(result);
    }
    return result;
  });
});

/**
 * [createUser description]
 *
 * @method
 * @param  {!Object} options [description]
 * @param {!string} options.username [description]
 * @param {!string} options.salt [description]
 * @param {!string} options.digest [description]
 * @param {?boolean} [options.admin=false] [description]
 * @param {?boolean} [options.simple=true] [description]
 * @return {Promise.<Sequelize.Instance|Object>}
 */
AuthClient.prototype.createUser = BPromise.method(function(options) {
  options = _.defaultsDeep(options || {}, {
    simple: true,
    admin: false
  });
  log.debug('options:', options);

  if (!options.username || !options.salt || !options.digest) {
    throw new Error('Username, salt, and digest are all required parameters');
  }
  if (options.username.length > USERNAME_MAX_LENGTH) {
    throw new Error('Username must be no longer than ' + USERNAME_MAX_LENGTH +
                    ' characters. The provided username is ' +
                    options.username.length + ' characters.');
  }

  log.debug('createUser for username:', options.username);
  return sanitizeUsername(options.username)
  .bind(this)
  .then(username => {
    return this.models.Users.create({
      username,
      salt: options.salt,
      digest: options.digest,
      isAdmin: options.admin
    });
  })
  .then(result => {
    if (options.simple) {
      return datadb.makePlain(result);
    }
    return result;
  });
});

/**
 * [removeUser description]
 *
 * @method
 * @param  {!Object} options [description]
 * @param {?string} options.username [description]
 * @param {?string|number} options.id [description]
 * @param {?boolean} [options.simple=true] [description]
 * @return {Promise.<Sequelize.Instance|Object>}
 */
AuthClient.prototype.removeUser = BPromise.method(function(options) {
  if (!(options.username || options.id)) {
    throw new Error('One of username or id are required parameters');
  }
  if (options.id && options.username) {
    log.warn('Both Id and Username provided. Username param will be ignored.');
  }

  if (options.id) {
    return this.models.Users.destroy({where: {id: options.id}});
  }
  if (options.username) {
    return this.models.Users.destroy({where: {username: options.username}});
  }
});

module.exports = {
  create: options => new AuthClient(options),
  USERNAME_MAX_LENGTH
};
