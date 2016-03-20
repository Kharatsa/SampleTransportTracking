'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaRejectionsClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaRejectionsClient, MetaClient);

module.exports = function(options) {
  return new MetaRejectionsClient(options);
};
