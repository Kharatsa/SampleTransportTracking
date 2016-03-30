'use strict';

const regions = require('./metaregions.js');
const facilities = require('./metafacilities.js');
const people = require('./metapeople.js');
const artifacts = require('./metaartifacts.js');
const statuses = require('./metastatuses.js');
const labTests = require('./metalabtests.js');
const rejections = require('./metarejections.js');
const stages = require('./metastages.js');

module.exports = {
  regions,
  facilities,
  people,
  artifacts,
  statuses,
  labTests,
  rejections,
  stages
};
