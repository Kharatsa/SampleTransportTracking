'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaLabTestsClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaLabTestsClient, MetaClient);

module.exports = function(options) {
  return new MetaLabTestsClient(options);
};
