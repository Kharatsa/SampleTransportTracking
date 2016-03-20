'use strict';

const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const preload = require('app/server/storage/preload.js');
const sttsubmission = require('app/server/stt/sttsubmission.js');
// const fakedata = require('../../test/utils/fakedata.js');

module.exports = () => {
  const preloadMetadata = storage.db.sync()
  .then(() => [
    {
      filename: 'riders.csv',
      handler: sttsubmission.metaPeople,
      attributes: {key: 'rider_key', value: 'rider'}
    }, {
      filename: 'conditions.csv',
      handler: sttsubmission.metaStatuses,
      attributes: {key: 'cond_key', value: 'cond'}
    }, {
      filename: 'regions.csv',
      handler: sttsubmission.metaRegions,
      attributes: {key: 'region_key', value: 'region'}
    }, {
      // TODO: remove when facilities list is completed
      filename: 'facilities.csv',
      handler: sttsubmission.metaFacilities,
      attributes: {key: 'facility_key', value: 'facility', region: 'region'}
    }, {
      filename: 'stypes.csv',
      handler: sttsubmission.metaArtifacts,
      attributes: {key: 'stype_key', value: 'stype'}
    }, {
      filename: 'stages.csv',
      handler: sttsubmission.metaStages,
      attributes: {key: 'stages_key', value: 'stage'}
    }
  ])
  .mapSeries(preload.metadata)
  .then(() => log.info('Metadata preload completed'))
  .catch(err => log.error(err, err.stack));

  if (process.env.NODE_ENV !== 'production') {
    return preloadMetadata.then(() => {});
    // return preloadMetadata.then(() => fakedata.load());
  }

  return preloadMetadata;
};
