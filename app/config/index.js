'use strict';

const serverconfig = require('config/serverconfig.js');
const dbconfig = require('config/dbconfig.js');
const odkconfig = require('config/odkconfig.js');
const commonconfig = require('config/commonconfig.js');

module.exports = {
  server: serverconfig,
  db: dbconfig,
  odk: odkconfig,
  common: commonconfig,
};
