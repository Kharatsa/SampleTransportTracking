'use strict';

const BPromise = require('bluebird');
// const log = require('app/server/util/logapp.js');
const storage = require('app/server/storage');
const sync = require('app/server/util/datasync.js');
const datamerge = require('app/server/util/datamerge.js');
const disatransform = require('app/server/disa/disatransform.js');
const disasync = require('app/server/disa/disasync.js');

// TODO: remove
const DEBUG = (message, value) => {
  console.log(`DEBUG ${message}`);
  console.dir(value, {depth: 10});
};

const handleSamplesIds = sampleIds => {
  return disasync.fetchLocalSampleIds(sampleIds)
  .then(local => datamerge.pairLocalByPropKeys([sampleIds], [local], ['stId']))
  .then(merged => sync.persistMergedData({
    model: storage.models.SampleIds, merged, modelPKs: ['uuid']
  }));
};

const handleMetadata = meta => {
  return disasync.fetchLocalMeta(meta)
  .then(local => datamerge.pairLocalByPropKeys(meta, local, ['type', 'key']))
  .then(merged => sync.persistMergedData({
    model: storage.models.Metadata, merged, modelPKs: ['id']
  }));
};

const handleLabTests = (labTests, sampleRef) => {
  // TODO: maybe move to disatransform
  const fillSampleRefs = BPromise.map(labTests,
    test => Object.assign({}, test, {sampleId: sampleRef})
  )
  .tap(r => DEBUG('handleLabTests fillSampleRefs results', r));

  // TODO: refactor, since sampleIds.uuid can already included here?
  // (via fillSampleRefs)
  // TODO: Fix -- this fetches results when labTests is empty
  // TODO: better handling for empty/null expected values overall
  // TODO: add unit tests for null/empty cases
  const fetchLocal = disasync.fetchLocalLabTests(sampleRef, labTests)
  .tap(r => DEBUG('handleLabTests fetchLocalLabTests results', r));

  return BPromise.join(fillSampleRefs, fetchLocal, (tests, local) =>
    datamerge.pairLocalByPropKeys(tests, local, ['testType'])
    .tap(r => DEBUG('handleLabTests merged', r))
    .then(merged => sync.persistMergedData({
      model: storage.models.LabTests, merged, modelPKs: ['uuid']
    }))
  );
};

const handleChanges = (changes, labTests) => {
  const fillChanges = disatransform.fillChangesLabTestRefs(changes, labTests)
  .tap(r => DEBUG('handleChanges fillChangesLabTestRefs results', r));

  const fetchLocal = fillChanges.then(disasync.fetchLocalChanges)
  .tap(r => DEBUG('handleChanges fetchLocalChanges results', r));

  return BPromise.join(fillChanges, fetchLocal,
    (filled, local) => {
      // TODO: review which keys are really needed here
      return datamerge.pairLocalByPropKeys(filled, local, ['labTest', 'status']);
    }
  )
  .tap(r => DEBUG('handleChanges merged', r))
  .then(merged => sync.persistMergedData({
    model: storage.models.Changes, merged, modelPKs: ['uuid']
  }));
};

const pluckLocalSampleId = s => s.inserted[0] || s.updated[0] || s.skipped[0];

const handleSubmission = incoming => {
  const samples = handleSamplesIds(incoming.sampleIds);
  const metadata = handleMetadata(incoming.metadata);

  const labTests = samples.then(
    samplesResult => {
      const s = pluckLocalSampleId(samplesResult);
      console.log('pluckLocalSampleId', s);
      return handleLabTests(incoming.labTests, s.uuid);
    }
  );

  // Wait for the labTests promise to resolve, but the local lab test data will
  // be retrieved separately for changes (to accomodate the generic "*" lab test
  // in submissions, representing "all tests for this sampleId")
  const changes = BPromise.join(samples, labTests,
    samplesResult => {
      const s = pluckLocalSampleId(samplesResult);
      console.log('pluckLocalSampleId', s);
      return disasync.sampleIdsLabTests(s.uuid);
    }
  )
  .tap(r => DEBUG('sampleIdsLabTests results', r))
  .then(sampleIdsTests => handleChanges(incoming.changes, sampleIdsTests));

  // labTests.then(tests => {
  //   const allTests = [].concat(tests.inserted, tests.updated, tests.skipped);
  //   return handleChanges(incoming.changes, allTests);
  // });

  return BPromise.props({samples, metadata, labTests, changes})
  .tap(r => DEBUG('handleSubmission results', r));
};

module.exports = {
  handleSubmission
};
