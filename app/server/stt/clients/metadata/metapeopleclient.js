'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaPeopleClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaPeopleClient, MetaClient);

module.exports = function(options) {
  return new MetaPeopleClient(options);
};
