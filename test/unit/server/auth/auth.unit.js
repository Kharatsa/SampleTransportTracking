'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const config = require('config');
const credentials = require('server/auth/credentials.js');
const users = require('server/auth/models/users.js');
const storage = require('server/storage');
const authclient = require('server/auth/authclient.js');

describe('Authentication Components', () => {

  describe('credentials utilities', () => {
    const password = 'test';

    it('should produce unique digests for identical passwords', () => {
      return credentials.protect(password)
      .then(first => {
        return credentials.protect(password)
        .then(second => {
          expect(second).to.not.equal(first);
        });
      });
    });

    it('should verify a password given a digest', () => {
      return credentials.protect(password)
      .then(digest => {
        console.log('digest= ', digest);
        console.log('password= ', password);
        return credentials.isValid(password, digest);
      })
      .then(valid => {
        console.log('valid=', valid);
        expect(valid).to.be.true;
      });
    });

  });

  describe('authentication client', () => {
    var client;
    var username = 'testuser';
    var password = 'password';

    before(() => {
      storage.init({config: config.db});
      storage.loadModel(users);

      client = authclient({
        db: storage.db, models: storage.models
      });

      return storage.db.sync();
    });

    it('should create new users', () => {
      return credentials.protect(password)
      .then(digest => client.createUser({username, digest}))
      .then(user => {
        expect(user.username).to.equal(username.toUpperCase());
      });
    });

    it('should not allow long usernames', () => {
      var invalid = [];
      var charCount = authclient.USERNAME_MAX_LENGTH + 1;
      for (var i = 0; i < charCount; i++) {
        invalid.push('a');
      }

      return credentials.protect(password)
      .then(result => client.createUser({
        username: invalid.join(''),
        digest: result.digest
      }))
      .then(user => expect(user).to.be.undefined)
      .catch(err => expect(err).to.be.instanceof(Error));
    });

    it('should not allow empty usernames', () =>
      expect(
        credentials.protect('password')
        .then(result => client.createUser({
          username: '', digest: result.digest
        }))
      ).to.eventually.be.rejectedWith(Error)
    );

    it('should get existing users with sensitive data', () => {
      return client.getUser({username, includeCredentials: true})
      .then(user => {
        expect(user.username).to.equal(username.toUpperCase());
        return credentials.isValid(password, user.digest);
      })
      .then(valid => expect(valid).to.be.true);
    });

    it('should get existing users excluding sensitive data', () => {
      return client.getUser({username})
      .then(user => {
        expect(user.username).to.equal(username.toUpperCase());
        expect(user.digest).to.be.undefined;
      });
    });

  });

});
