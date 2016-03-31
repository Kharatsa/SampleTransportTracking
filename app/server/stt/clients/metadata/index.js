'use strict';

const facilities = require('./metafacilitiesclient.js');
const districts = require('./metaclientbase.js');
const labs = require('./metaclientbase.js');
const regions = require('./metaclientbase.js');
const people = require('./metaclientbase.js');
const artifacts = require('./metaclientbase.js');
const labTests = require('./metaclientbase.js');
const rejections = require('./metaclientbase.js');
const statuses = require('./metaclientbase.js');
const stages = require('./metaclientbase.js');

module.exports = {
  regions,
  facilities,
  districts,
  labs,
  people,
  artifacts,
  labTests,
  rejections,
  statuses,
  stages
};
