'use strict';

const util = require('util');
const MetaClient = require('./metaclient.js');
const metaquery = require('./metaquery.js');

function MetaFacilitiesClient(options) {
  MetaClient.call(this, options);
}
util.inherits(MetaFacilitiesClient, MetaClient);

MetaFacilitiesClient.prototype.byRegionKey = function(options) {
  return metaquery.facilityRegion(options.data)
  .then(where => this.Model.findAll({where}));
};

module.exports = function(options) {
  return new MetaFacilitiesClient(options);
};
