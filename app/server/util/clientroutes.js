'use strict';

const express = require('express');
const router = express.Router();

const clientDirectRoutes = [
  '/facilities',
  '/samples',
  '/riders'
];

const clientRedirectRoutes = ['/events'];

module.exports = router;
