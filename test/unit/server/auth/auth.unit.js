'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const config = require('app/config');
const credentials = require('app/server/auth/credentials.js');
const users = require('app/server/auth/models/users.js');
const storage = require('app/server/storage');
const authclient = require('app/server/auth/authclient.js');

describe('Authentication Components', () => {

  describe('credentials utilities', () => {
    var password = 'password';

    it('should produce unique digests for identical passwords', done => {
      return credentials.protect(password)
      .then(first => {
        var firstSalt = first.salt;
        var firstDigest = first.digest;
        return credentials.protect(password)
        .then(second => {
          expect(second.salt).to.not.equal(firstSalt);
          expect(second.digest).to.not.equal(firstDigest);
        });
      })
      .then(() => done());
    });

    it('should verify a password given a salt and digest', done => {
      return credentials.protect(password)
      .then(result => {
        // These would be saved in a db for a given user
        var salt = result.salt;
        var initialDigest = result.digest;

        // Re-hash the password with the salt
        return credentials.hash(password, salt)
        .then(newDigest =>
          expect(newDigest).to.equal(initialDigest)
        )
        .then(() => credentials.isValid(password, salt, initialDigest))
        .then(valid =>
          expect(valid).to.be.true
        );
      })
      .then(() => done());
    });
  });

  describe('authentication client', () => {
    var client;
    var username = 'testuser';
    var password = 'password';

    before(done => {
      storage.init({config: config.db});
      storage.loadModel(users);

      client = authclient({
        db: storage.db,
        models: storage.models
      });

      return storage.db.sync().then(() => done());
    });

    it('should create new users', done => {
      return credentials.protect(password)
      .then(result => client.createUser({
        username, salt: result.salt, digest: result.digest
      }))
      .then(user => {
        expect(user.username).to.equal(username.toUpperCase());
      }).then(() => done());
    });

    it('should not allow long usernames', done => {
      var invalid = [];
      var charCount = authclient.USERNAME_MAX_LENGTH + 1;
      for (var i = 0; i < charCount; i++) {
        invalid.push('a');
      }

      return credentials.protect(password)
      .then(result => client.createUser({
        username: invalid.join(''),
        salt: result.salt,
        digest: result.digest
      }))
      .then(user => expect(user).to.be.undefined)
      .catch(err => expect(err).to.be.instanceof(Error))
      .then(() => done());
    });

    it('should not allow empty usernames', () =>
      expect(
        credentials.protect('password')
        .then(result => client.createUser({
          username: '', salt: result.salt, digest: result.digest
        }))
      ).to.eventually.be.rejectedWith(Error)
    );

    it('should get existing users', done => {
      client.getUser({username})
      .then(user => {
        expect(user.username).to.equal(username.toUpperCase());
        return credentials.isValid(password, user.salt, user.digest);
      })
      .then(valid => expect(valid).to.be.true).then(() => done());
    });

  });

});
