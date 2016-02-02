'use strict';

const BPromise = require('bluebird');
const sttsubmission = require('app/server/stt/sttsubmission.js');
const disatransform = require('app/server/disa/disatransform.js');

// TODO: remove
// const DEBUG = (message, value) => {
//   if (process.env.NODE_ENV === 'test') {
//     console.log(`DEBUG ${message}`);
//     console.dir(value, {depth: 10});
//   }
// };

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

  return BPromise.props({sampleIds, metadata, labTests, changes});
  // .tap(r => DEBUG('disasubmission results', r));
};

module.exports = {
  handleSubmission
};
