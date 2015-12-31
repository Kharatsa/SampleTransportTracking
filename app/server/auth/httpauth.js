'use strict';

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const log = require('app/server/util/log.js');
const storage = require('app/server/storage');
const authclient = require('./authclient.js');
const credentials = require('./credentials.js');

const client = authclient.create({db: storage.db, models: storage.models});

// Configures the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `callback`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new BasicStrategy(
  function(username, password, callback) {
    log.debug('Authenticating username=`%s`, password=`%s`', username, password);
    return client.getUser({username})
    .then(user => {
      if (!user) {
        return false;
      }

      log.debug('Validating credentials for user:', user);
      return credentials.isValid(password, user.salt, user.digest)
      .then(valid => valid ? user : false);
    })
    .then(result => callback(null, result))
    .catch(err => callback(err));
  })
);

module.exports = passport;
