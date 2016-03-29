'use strict';

const _ = require('lodash');
const BPromise = require('bluebird');

// Raw query result column name constants
const parentModelName = 'Change';
const refModelName = 'Ref';
const artifactModelName = 'Artifact';
const artifactRefKey = `${parentModelName}.artifact`;
const artifactTypeKey = `${refModelName}.artifactType`;
const labTestModelName = 'LabTest';
const labTestRefKey = `${parentModelName}.labTest`;
const labTestTypeKey = `${refModelName}.testType`;
const sampleIdModelName = 'SampleId';

const changeResultTemplate = (change, hasArtifact, hasLabTest) => {
  let template = {};
  if (hasArtifact) {
    template[artifactModelName] = {};
  }
  if (hasLabTest) {
    template[labTestModelName] = {};
  }
  return template;
};

// The raw query UNION clobbers the column name for labTests
const maybeRenameRefType = (change, hasArtifact, hasLabTest) => {
  if (hasLabTest) {
    change[labTestTypeKey] = change[artifactTypeKey];
    return _.omit(change, artifactTypeKey);
  }
  return change;
};

/**
 * Reconstitutes Changes, Artifacts, and LabTests Model objects from the
 * flattened raw query results. The top-level object is a Change, which includes
 * either a nested Artifact (when Changes.artifact !== null) or a nested
 * LabTest (when Changes.labTest !== null).
 *
 * @param  {Object} rawChange  Raw query result row
 * @return {Promise.<Object>}
 */
const recomposeRawChanges = rawChange => {
  const hasArtifact = rawChange[artifactRefKey] !== null;
  const hasLabTest = rawChange[labTestRefKey] !== null;

  let template = changeResultTemplate(rawChange, hasArtifact, hasLabTest);
  rawChange = maybeRenameRefType(rawChange, hasArtifact, hasLabTest);

  let sample = {};

  return BPromise.reduce(Object.keys(rawChange), (reduced, key) => {
    const parts = key.split('.');
    const modelName = parts[0];
    const columnName = parts[1];
    const value = rawChange[key];

    if (modelName === parentModelName) {
      reduced[columnName] = value;
    } else if (modelName === sampleIdModelName) {
      sample[columnName] = value;
      // reduced[sampleIdModelName][columnName] = value;
    } else if (hasArtifact && modelName === refModelName) {
      reduced[artifactModelName][columnName] = value;
    } else if (hasLabTest && modelName === refModelName) {
      reduced[labTestModelName][columnName] = value;
    }

    return reduced;
  }, template)
  .then(change => {
    if (hasArtifact) {
      change[artifactModelName][sampleIdModelName] = sample;
    } else if (hasLabTest) {
      change[labTestModelName][sampleIdModelName] = sample;
    }
    return change;
  });
};


module.exports = {
  recomposeRawChanges
};
