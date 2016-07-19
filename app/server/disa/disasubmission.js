'use strict';

const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const sttsubmission = require('server/stt/sttsubmission.js');
const disatransform = require('server/disa/disatransform.js');

const handleSubmission = incoming => {
  // Facilies reference regions, so regions must finish inserts/updates first
  const metaFacility = sttsubmission.metaFacilities([incoming.metaFacility])
  .catch((err) => {
    log.error(err.message, err);
    throw new Error('Facility key "' + incoming.metaFacility.key +
                    '" conflicts with existing facility key');
  });
  log.info('Handling Disa Submission')
  const metaStatuses = sttsubmission.metaStatuses(incoming.metaStatuses);
  const metaLabTests = sttsubmission.metaLabTests(incoming.metaLabTests);
  const metaRejections = sttsubmission.metaRejections(incoming.metaRejections);
  const meta = BPromise.join(metaFacility, metaStatuses, metaLabTests,
                             metaRejections)
                .tap(result => log.info('Finished handling meta', result))

  const sampleIds = meta.then(() =>
    sttsubmission.sampleIds([incoming.sampleIds]));

  // Pull the sample id UUID from the sampleIds results for labTests lookups
  const sampleIdsRef = sampleIds
  .then(sttsubmission.syncedCombine)
  .map(sampleIds => sampleIds.uuid)
  .then(results => results && results.length ? results[0] : {});

  const testsWithRefs = sampleIdsRef.then(idsRef =>
    disatransform.fillSampleIdRefs(incoming.labTests, idsRef)
  );

  const labTests = (
    testsWithRefs.then(sttsubmission.labTests)
    .tap(result => log.info('labTestsWithRefs', result)));
  const allTests = labTests.then(sttsubmission.syncedCombine);

  const changes = allTests
  .then(tests => disatransform.fillTestRefs(incoming.changes, tests))
  .then(sttsubmission.labChanges);

  return BPromise.props({
    sampleIds, labTests, changes,
    metaFacility, metaStatuses, metaLabTests, metaRejections
  })
  .tap(log.info);
};

module.exports = {
  handleSubmission
};
