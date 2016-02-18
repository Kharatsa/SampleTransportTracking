'use strict';

const BPromise = require('bluebird');
const log = require('app/server/util/logapp.js');
const sttsubmission = require('app/server/stt/sttsubmission.js');
const collecttransform = require('app/server/odk/collect/collecttransform.js');

const handleSubmission = incoming => {
  const sampleIds = sttsubmission.sampleIds(incoming.sampleIds);

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

  return BPromise.props({sampleIds, artifacts, changes})
  .tap(log.info)
  .catch(log.error);
};

module.exports = {handleSubmission};
