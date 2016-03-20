'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaStagesClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaStagesClient, MetaClient);

module.exports = function(options) {
  return new MetaStagesClient(options);
};
