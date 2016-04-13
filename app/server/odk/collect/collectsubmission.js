'use strict';

const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const sttsubmission = require('server/stt/sttsubmission.js');
const collecttransform = require('server/odk/collect/collecttransform.js');

const handleSubmission = incoming => {
  // Unrecognized/new metadata parsed from collect submissions will be inserted
  // in the database, but with a null value (i.e., display name), since none is
  // metadata descriptions are included with collect submissions.
  const metaRegion = sttsubmission.metaRegions([incoming.metaRegion]);
  // Facilies reference regions, so regions must finish inserts/updates first
  const metaFacility = metaRegion.then(() =>
    sttsubmission.metaFacilities([incoming.metaFacility]));
  const metaPerson = sttsubmission.metaPeople([incoming.metaPerson]);
  const meta = BPromise.join(metaRegion, metaFacility, metaPerson);

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

  // Wait for metadata inserts/updates to complete before handling changes
  const changes = BPromise.join(artifactsWithRefs, meta)
  .spread(artifactRefs => sttsubmission.scanChanges(artifactRefs));

  return BPromise.props({
    sampleIds, artifacts, changes, metaRegion, metaFacility, metaPerson
  })
  .tap(log.info);
};

module.exports = {handleSubmission};
