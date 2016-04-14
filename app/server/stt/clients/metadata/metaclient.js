'use strict';

const util = require('util');
const BPromise = require('bluebird');
const ModelClient = require('server/stt/clients/modelclient.js');
const queryutils = require('server/storage/queryutils.js');
const metaquery = require('./metaquery.js');

function MetaClient(options) {
  ModelClient.call(this, options);
}
util.inherits(MetaClient, ModelClient);

const DEFAULT_SORT = [['value', 'ASC']];

/**
 * @param  {QueryOptions} options
 * @return {Promise.<Array.<Object>>}
 */
MetaClient.prototype.create = BPromise.method(function(options) {
  options = options || {};
  if (typeof options.data === 'undefined') {
    throw new Error('Missing required parameter data');
  }
  const items = Array.isArray(options.data) ? options.data : [options.data];

  return this.db.transaction({}, tran => {
    return queryutils.havePropsDefined(items, ['key'])
    .then(() => (items))
    .map(values => this.Model.create(values, {transaction: tran}));
  });
});

MetaClient.prototype.byKey = function(options) {
  return metaquery.key(options.data)
  .then(where => this.Model.findAll({where, order: DEFAULT_SORT}));
};

MetaClient.prototype.all = function() {
  return this.Model.findAll({order: DEFAULT_SORT});
};

MetaClient.prototype.deleteByKey = function(options) {
  return metaquery.key(options.data)
  .then(where => this.Model.destroy({where}));
};

MetaClient.prototype.updateByKey = function(options) {
  return metaquery.key(options.data);
};

MetaClient.prototype.describeSchema = function() {
  return this.Model.describe();
};

module.exports = MetaClient;
