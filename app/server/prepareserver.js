'use strict';

const log = require('server/util/logapp.js');
const storage = require('server/storage');
const preload = require('server/storage/preload.js');
const sttsubmission = require('server/stt/sttsubmission.js');

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
      filename: 'labstatus.csv',
      handler: sttsubmission.metaStatuses,
      attributes: {key: 'status_key', value: 'status'}
    }, {
      filename: 'districts.csv',
      handler: sttsubmission.metaDistricts,
      attributes: {key: 'district_key', value: 'district'}
    }, {
      filename: 'labs.csv',
      handler: sttsubmission.metaLabs,
      attributes: {key: 'lab_key', value: 'lab', district: 'district'}
    }, {
      filename: 'facilities.csv',
      handler: sttsubmission.metaFacilities,
      attributes: {key: 'facility_key', value: 'facility', region: 'lab'}
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
  return preloadMetadata;
};
