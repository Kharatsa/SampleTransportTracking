'use strict';

const serverconfig = require('./serverconfig.js');
const dbconfig = require('./dbconfig.js');
const odkconfig = require('./odkconfig.js');
const commonconfig = require('./commonconfig.js');

module.exports = {
  server: serverconfig,
  db: dbconfig,
  odk: odkconfig,
  common: commonconfig,
};
