'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaFacilitiesClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaFacilitiesClient, MetaClient);

module.exports = function(options) {
  return new MetaFacilitiesClient(options);
};
