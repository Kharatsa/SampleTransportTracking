'use strict';

const bcrypt = require('bcrypt');
const BPromise = require('bluebird');
// const log = require('server/util/logapp.js');

const genSalt = BPromise.promisify(bcrypt.genSalt);
const hash = BPromise.promisify(bcrypt.hash);
const compare = BPromise.promisify(bcrypt.compare);

const SALT_ROUNDS = 8;  // 2^SALT_ROUNDS
const HASH_LENGTH = 60;
const HASH_TYPE = 'bcrypt';

/**
 * Generate a new hash for the specified password.
 *
 * @param  {!string} password
 * @param  {Object} options
 * @return {Promise.<string>}
 */
const protect = (password, options) => {
  options = options || {};
  const rounds = options.rounds || SALT_ROUNDS;
  return genSalt(rounds)
  .then(salt => hash(password, salt));
};

module.exports = {
  protect, hash, isValid: compare,
  SALT_ROUNDS, HASH_LENGTH, HASH_TYPE,
};
