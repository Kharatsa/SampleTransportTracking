'use strict';

const BPromise = require('bluebird');
const storage = require('app/server/storage');
const sync = require('app/server/util/datasync.js');
const datamerge = require('app/server/util/datamerge.js');
const disatransform = require('app/server/disa/disatransform.js');
const disasync = require('app/server/disa/disasync.js');

// TODO: remove
// const DEBUG = (message, value) => {
//   if (process.env.NODE_ENV === 'test') {
//     console.log(`DEBUG ${message}`);
//     console.dir(value, {depth: 10});
//   }
// };

const handleSampleIds = sampleIds => {
  return disasync.localSampleIds(sampleIds)
  .then(local => datamerge.pairByProps([sampleIds], [local], ['stId']))
  .then(merged => sync.persistMergedData({
    model: storage.models.SampleIds, merged, modelPKs: ['uuid']
  }));
};

const handleMetadata = incoming => {
  return disasync.localMeta(incoming)
  .then(local => datamerge.pairByProps(incoming, local, ['type', 'key']))
  .then(merged => sync.persistMergedData({
    model: storage.models.Metadata, merged, modelPKs: ['id']
  }));
};

const handleLabTests = (incoming, local, sampleRef) => {
  const fillRefs = disatransform.fillSampleIdRefs(incoming, sampleRef);
  const mergeTests = fillRefs.then(filled =>
    datamerge.pairByProps(filled, local, ['testType'])
  );

  return mergeTests.then(merged => sync.persistMergedData({
    model: storage.models.LabTests, merged, modelPKs: ['uuid']
  }));
};

const handleChanges = (changes, tests) => {
  const fillRefs = disatransform.fillTestRefs(changes, tests);
  const fetchLocal = fillRefs.then(disasync.localChanges);
  const mergeChanges = BPromise.join(fillRefs, fetchLocal, (filled, local) =>
    datamerge.pairByProps(filled, local, ['labTest', 'status'])
  );

  return mergeChanges.then(merged => sync.persistMergedData({
    model: storage.models.Changes, merged, modelPKs: ['uuid']
  }));
};

const handleSubmission = incoming => {
  const sampleIds = handleSampleIds(incoming.sampleIds);
  const metadata = handleMetadata(incoming.metadata);

  // Pull the sample id UUID from the sampleIds results for labTests lookups
  const sampleRef = sampleIds.then(result => {
    const s = result.inserted[0] || result.updated[0] || result.skipped[0];
    return s.uuid;
  });

  const localTests = sampleRef.then(disasync.sampleIdLabTests);
  const labTests = BPromise.join(sampleRef, localTests, (ref, local) =>
    handleLabTests(incoming.labTests, local, ref)
  );

  // The lab tests results used to fill the collection of change records must be
  // extended to include any existing tests prior to this submission (for the
  // given sampleId). This accomodates cases where an "*", representing an "all
  // tests" signifier, is included with a new submission.
  const extendedTests = BPromise.join(localTests, labTests, (prior, post) =>
    [].concat(prior, post.inserted, post.updated, post.skipped)
  );

  const changes = extendedTests.then(tests =>
    handleChanges(incoming.changes, tests)
  );

  return BPromise.props({sampleIds, metadata, labTests, changes});
  // .tap(r => DEBUG('handleSubmission results', r));
};

module.exports = {
  handleSubmission
};
