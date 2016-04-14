'use strict';

const crypto = require('crypto');
const BPromise = require('bluebird');
BPromise.promisifyAll(crypto);
const log = require('server/util/logapp.js');

const ITERATIONS = 500;
const KEYLEN = 512;
const ALGORITHM = 'sha512';
const PASSWORD_MAX_LENGTH = 160;

/**
 * [hash description]
 *
 * @function
 * @param  {!string} password [description]
 * @param  {!string} salt     [description]
 * @return {Promise.<string>}
 * @throws {Error} If [password.length > 160]
 */
const hash = BPromise.method(function hashFunc(password, salt) {
  if (password.length > PASSWORD_MAX_LENGTH) {
    return new Error('Passwords must be <= 160 characters');
  }

  return crypto.pbkdf2Async(password, salt, ITERATIONS, KEYLEN, ALGORITHM)
  .catch(err => log.error('Error generating hash', err.message, err.stack))
  .then(derivedKey => derivedKey.toString(DIGEST_ENCODING));
});

/**
 * @typedef {Protect}
 * @type {Object}
 * @param {string} salt [description]
 * @param {string} digest [description]
 */

/**
 * [protect description]
 *
 * @param  {!string} password [description]
 * @return {Promise.<Protect>} [description]
 * @throws {Error} If [password.length > 160]
 */
function protect(password) {
  return generateSalt()
  .then(salt =>
    hash(password, salt)
    .then(digest => ({salt, digest}))
  );
}

const DIGEST_ENCODING = 'hex';
const SALT_BYTES = 64;

function generateSalt() {
  return crypto.randomBytesAsync(SALT_BYTES)
  .then(buff => buff.toString(DIGEST_ENCODING))
  .catch(err => log.error('Error generating salt', err.message, err.stack));
}

/**
 * [isValid description]
 *
 * @param  {string} password [description]
 * @param  {string} salt     [description]
 * @param  {string} expectedDigest     [description]
 * @return {Promise.<bool>}          [description]
 * @throws {Error} If [password.length > 160]
 */
function isValid(password, salt, expectedDigest) {
  return hash(password, salt)
  .then(passwordDigest => passwordDigest === expectedDigest);
}

module.exports = {
  protect,
  hash,
  isValid
};
