'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');

function MetaArtifactsClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaArtifactsClient, MetaClient);

module.exports = function(options) {
  return new MetaArtifactsClient(options);
};
