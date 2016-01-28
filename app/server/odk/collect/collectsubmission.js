'use strict';

const BPromise = require('bluebird');
const sttsubmission = require('app/server/stt/sttsubmission.js');
const collecttransform = require('app/server/odk/collect/collecttransform.js');

// TODO: remove
const DEBUG = (message, value) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`DEBUG ${message}`);
    console.dir(value, {depth: 10});
  }
};

const handleSubmission = incoming => {
  const sampleIds = sttsubmission.sampleIds(incoming.sampleIds);
  const metadata = sttsubmission.metadata(incoming.metadata);

  const allSampleIds = sampleIds.then(sttsubmission.syncedCombine);

  const artifacts = allSampleIds
  .then(ids => collecttransform.fillSampleIdRefs(incoming.artifacts, ids))
  .then(sttsubmission.artifacts);

  const allArtifacts = artifacts.then(sttsubmission.syncedCombine);
  const artifactsWithRefs = BPromise.join(allSampleIds, allArtifacts)
  .spread((ids, items) =>
    collecttransform.fillArtifactRefs(incoming.changes, ids, items)
  );

  const changes = artifactsWithRefs.then(sttsubmission.scanChanges);

  return BPromise.props({sampleIds, metadata, artifacts, changes})
  .tap(r => DEBUG('collectsubmission results', r));
};

module.exports = {handleSubmission};
