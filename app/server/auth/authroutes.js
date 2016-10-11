'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const permissions = require('server/middleware/permissions.js');
const storage = require('server/storage');
const AuthClient = require('server/auth/authclient.js');
const credentials = require('server/auth/credentials.js');

const jsonParser = bodyParser.json();

const authclient = AuthClient({db: storage.db, models: storage.models});

router.get('/users', permissions.requireAdmin, (req, res, next) =>
  authclient.all()
  .then(users => res.json(users))
  .catch(next));

router.get('/users/me', (req, res, next) => {
  return authclient.getUser({username: req.user.username})
  .then(user => res.json(user))
  .catch(next);
});

router.get('/users/:username', (req, res, next) => {
  return authclient.getUser({username: req.params.username})
  .then(user => {
    if (user) {
      res.json(user);
    } else {
      const err = new Error(`No user with username "${req.params.username}"`);
      err.status = 404;
      throw err;
    }
  })
  .catch(next);
});

router.post('/users/:username/create', permissions.requireAdmin, jsonParser,
  (req, res, next) => {
    return authclient.getUser({username: req.params.username})
    .then(() => credentials.protect(req.body.password))
    .then(({salt, digest}) => authclient.createUser({
      salt, digest,
      username: req.params.username,
      isAdmin: req.body.isAdmin,
    }))
    .then(() => authclient.getUser({username: req.params.username}))
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err instanceof sequelize.UniqueConstraintError) {
        const dupeErr = new Error(`"${req.params.username}" already exists`);
        dupeErr.status = 400;
        throw dupeErr;
      }
      throw err;
    })
    .catch(next);
  });

// TODO(sean): update a user
router.post('/users/:username', permissions.requireAdmin, jsonParser,
  (req, res) => {
    res.send('TODO');
  });

module.exports = router;
