'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const sttsubmission = require('app/server/stt/sttsubmission.js');
const disatransform = require('app/server/disa/disatransform.js');

const handleSubmission = incoming => {
  const sampleIds = sttsubmission.sampleIds([incoming.sampleIds]);
  const metadata = sttsubmission.metadata(incoming.metadata);

  // Pull the sample id UUID from the sampleIds results for labTests lookups
  const sampleIdsRef = sampleIds
  .then(sttsubmission.syncedCombine)
  .map(sampleIds => sampleIds.uuid)
  .then(results => results && results.length ? results[0] : {});

  const testsWithRefs = sampleIdsRef.then(idsRef =>
    disatransform.fillSampleIdRefs(incoming.labTests, idsRef)
  );

  const labTests = testsWithRefs.then(sttsubmission.labTests);
  const allTests = labTests.then(sttsubmission.syncedCombine);

  const changes = allTests
  .then(tests => disatransform.fillTestRefs(incoming.changes, tests))
  .then(sttsubmission.labChanges);

  return BPromise.props({sampleIds, metadata, labTests, changes})
  .tap(log.info)
  .catch(log.error);
};

module.exports = {
  handleSubmission
};
