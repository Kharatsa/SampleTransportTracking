'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaStatusesClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaStatusesClient, MetaClient);

module.exports = function(options) {
  return new MetaStatusesClient(options);
};
