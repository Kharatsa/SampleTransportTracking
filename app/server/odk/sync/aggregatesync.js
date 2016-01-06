'use strict';

const log = require('app/server/util/log.js');
const aggregate = require('app/server/odk/aggregateapi.js');
const transform = require('app/server/odk/sync/aggregatetransform.js');
const storage = require('app/server/storage');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient.create({
  db: storage.db,
  models: storage.models
});

/**
 * Fetches the form list XML from ODK Aggregate, converts the XML to JSON,
 * transforms the JSON to {@link Form} models, then inserts these forms in
 * the database.
 *
 * @return {Promise.<Array.<Sequelize.Instance>} Resolves with an array of
 *                                               Sequelize Form instances.
 */
function syncFormList() {
  log.info('Sychronizing ODK Aggregate form list');

  return aggregate.formList()
  .spread((res, body) => body)
  .tap(xml => {
    log.debug('Received form list XML', xml);
  })
  .then(transform.parseFormList)
  // TODO: Maybe do a merge step here? (i.e., fetch existing data, bucket
  // new data into insert/update/skip)
  .then(parsed => client.saveForms(parsed));
}

module.exports = {
  syncFormList: syncFormList
};
