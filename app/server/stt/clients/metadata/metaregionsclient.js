'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaRegionsClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaRegionsClient, MetaClient);

module.exports = function(options) {
  return new MetaRegionsClient(options);
};
