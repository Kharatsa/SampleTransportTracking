'use strict';

const BPromise = require('bluebird');
const storage = require('app/server/storage');
const sttsubmission = require('app/server/stt/sttsubmission.js');
const disatransform = require('app/server/disa/disatransform.js');
const sttclient = require('app/server/stt/sttclient.js');

const client = sttclient({db: storage.db, models: storage.models});

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

  const localTests = sampleIdsRef.then(ref => ({sampleId: ref}))
  .then(ref => client.labTests.bySampleIds({data: [ref]}));

  const testsWithRefs = sampleIdsRef.then(idsRef =>
    disatransform.fillSampleIdRefs(incoming.labTests, idsRef)
  );

  const labTests = testsWithRefs.then(sttsubmission.labTests);
  const allTests = labTests.then(sttsubmission.syncedCombine);

  // The lab tests results used to fill the collection of change records must be
  // extended to include any existing tests prior to this submission (for the
  // given sampleId). This accomodates cases where an "*", representing an "all
  // tests" signifier, is included with a new submission.
  const extendedTests = BPromise.join(localTests, allTests)
  .spread((prior, post) => [].concat(prior, post));

  const changes = extendedTests
  .then(tests => disatransform.fillTestRefs(incoming.changes, tests))
  .then(sttsubmission.labChanges);

  return BPromise.props({sampleIds, metadata, labTests, changes});
  // .tap(r => DEBUG('disasubmission results', r));
};

module.exports = {
  handleSubmission
};
