'use strict';

const express = require('express');
const router = express.Router();
const storage = require('server/storage');
const AuthClient = require('server/auth/authclient.js');
const permissions = require('server/middleware/permissions.js');

const authclient = AuthClient({db: storage.db, models: storage.models});

// TODO(sean): list users
router.get('/users', permissions.requireAdmin, (req, res, next) => 
  authclient.all()
  .then(users => res.json(users))
  .catch(next)
);

// TODO(sean): get user
router.get('/users/:userId', (req, res) => {
  res.send('TODO');
});

// TODO(sean): create new users
router.post('/users', permissions.requireAdmin, (req, res) => {
  res.send('TODO');
});

module.exports = router;
