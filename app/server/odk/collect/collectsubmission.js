'use strict';

const BPromise = require('bluebird');
const storage = require('app/server/storage');
const datamerge = require('app/server/util/datamerge.js');
const collecttransform = require('app/server/odk/collect/collecttransform.js');
const sync = require('app/server/util/datasync.js');
// TODO: remove or replace with collect versions
const disasync = require('app/server/disa/disasync.js');
const collectsync = require('app/server/odk/collect/collectsync.js');

// TODO: remove
const DEBUG = (message, value) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`DEBUG ${message}`);
    console.dir(value, {depth: 10});
  }
};

// TODO: duplicated with disa
const handleSampleIds = sampleIds => {
  return collectsync.localSampleIds(sampleIds)
  .then(local => datamerge.pairByProps(sampleIds, local, ['stId']))
  // .tap(r => DEBUG('handleSampleIds merged', r))
  .then(merged => sync.persistMergedData({
    model: storage.models.SampleIds, merged, modelPKs: ['uuid']
  }));
};

const handleMetadata = incoming => {
  return disasync.localMeta(incoming)
  .then(local => datamerge.pairByProps(incoming, local, ['type', 'key']))
  // .tap(r => DEBUG('handleMetadata merged', r))
  .then(merged => sync.persistMergedData({
    model: storage.models.Metadata, merged, modelPKs: ['id']
  }));
};

const handleArtifacts = (incoming, sampleIds) => {
  const fillRefs = collecttransform.fillSampleIdRefs(incoming, sampleIds);
  // .tap(r => DEBUG('handleArtifacts fillRefs results', r));

  const fetchLocal = fillRefs.then(filled =>
    collectsync.localArtifacts(filled)
  );
  // .tap(r => DEBUG('handleArtifacts localArtifacts results', r));

  const mergeArtifacts = BPromise.join(fillRefs, fetchLocal,
    (filled, local) => datamerge.pairByProps(filled, local, ['artifactType'])
  );
  // .tap(r => DEBUG('handleArtifacts mergeArtifacts results', r));

  return mergeArtifacts.then(merged => sync.persistMergedData({
    model: storage.models.Artifacts, merged, modelPKs: ['uuid']
  }));
};

const handleChanges = (changes, sampleIds, artifacts) => {
  const fillRefs = collecttransform.fillArtifactRefs(
    changes, sampleIds, artifacts
  );
  // .tap(r => DEBUG('handleChanges fillRefs results', r));

  const fetchLocal = fillRefs.then(collectsync.localChanges);
  // .tap(r => DEBUG('handleChanges fetchLocal results', r));

  const mergeChanges = BPromise.join(fillRefs, fetchLocal, (filled, local) =>
    datamerge.pairByProps(filled, local, ['artifact', 'status'])
  );
  // .tap(r => DEBUG('handleChanges fetchLocal results', r));

  return mergeChanges.then(merged => sync.persistMergedData({
    model: storage.models.Changes, merged, modelPKs: ['uuid']
  }));
};

const handleSubmission = incoming => {
  // console.log('handleSubmission incoming', incoming);
  // console.dir(incoming, {depth: 10});

  const sampleIds = handleSampleIds(incoming.sampleIds);
  // .tap(r => DEBUG('sampleIds results', r));

  const metadata = handleMetadata(incoming.metadata);
  // .tap(r => DEBUG('metadata results', r));

  const artifacts = sampleIds.then(ids => {
    const allSampleIds = [].concat(ids.inserted, ids.updated, ids.skipped);
    // console.log('artifacts allSampleIds');
    // console.dir(allSampleIds, {depth: 10});
    return handleArtifacts(incoming.artifacts, allSampleIds);
  });
  // .tap(r => DEBUG('artifacts results', r));

  const changes = BPromise.join(sampleIds, artifacts, (ids, items) => {
    const allSampleIds = [].concat(ids.inserted, ids.updated, ids.skipped);
    const allArtifacts = [].concat(
      items.inserted, items.updated, items.skipped
    );
    // console.log('changes allSampleIds');
    // console.dir(allSampleIds, {depth: 10});
    // console.log('changes allArtifacts');
    // console.dir(allArtifacts, {depth: 10});
    return handleChanges(incoming.changes, allSampleIds, allArtifacts);
  });
  // .tap(r => DEBUG('changes results', r));

  return BPromise.props({sampleIds, metadata, artifacts, changes})
  .tap(r => DEBUG('handleSubmission results', r));
};

module.exports = {handleSubmission};
