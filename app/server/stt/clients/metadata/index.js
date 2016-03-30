'use strict';

const metaregionsclient = require('./metaregionsclient.js');
const metafacilitiesclient = require('./metafacilitiesclient.js');
const metapeopleclient = require('./metapeopleclient.js');
const metaartifactsclient = require('./metaartifactsclient.js');
const metalabtestsclient = require('./metalabtestsclient.js');
const metarejectionsclient = require('./metarejectionsclient.js');
const metastatusesclient = require('./metastatusesclient.js');
const metastagesclient = require('./metastagesclient.js');

module.exports = {
  regions: metaregionsclient,
  facilities: metafacilitiesclient,
  people: metapeopleclient,
  artifacts: metaartifactsclient,
  labTests: metalabtestsclient,
  rejections: metarejectionsclient,
  statuses: metastatusesclient,
  stages: metastagesclient
};
