'use strict';

const sampleids = require('./sampleids.js');
const metadata = require('./metadata');
const artifacts = require('./artifacts.js');
const labtests = require('./labtests.js');
const changes = require('./changes');

module.exports = {
  metadata, sampleids, artifacts, labtests, changes
};
