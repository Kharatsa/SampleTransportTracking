'use strict';

const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const preload = require('app/server/storage/preload.js');
const fakedata = require('../../test/data/fakedata.js');

module.exports = () => {
  const preloadMetadata = storage.db.sync()
  .then(() => [
    {filename: 'riders.csv', type: 'person', key: 'rider_key', value: 'rider'},
    {filename: 'conditions.csv', type: 'status', key: 'cond_key', value: 'cond'},
    {filename: 'regions.csv', type: 'region', key: 'region_key', value: 'region'},
    {filename: 'stypes.csv', type: 'artifact', key: 'stype_key', value: 'stype'}
  ])
  .mapSeries(preload.metadata)
  .then(() => log.info('Metadata preload completed'))
  .catch(err => log.error(err, err.stack));

  if (process.env.NODE_ENV !== 'production') {
    // TODO: remove when facilities list is completed
    const preloadTestMetadata = preloadMetadata.then(() =>
      preload.metadata({
        filename: 'facilities.csv',
        type: 'facility',
        key: 'facility_key',
        value: 'facility'
      })
    );

    return preloadTestMetadata.then(() => fakedata.load());
  }

  return preloadMetadata;
};
