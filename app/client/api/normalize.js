'use strict';

import {arrayOf, normalize} from 'normalizr';
import {Map as ImmutableMap, Seq} from 'immutable';
import {
  changeInclude, sample, metadata, sampleInclude
} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord, MetadataRecord
} from './records.js';

/**
 * Given an object keyed on UUIDs, returns an Immutable Map copy of that object
 * containing Immutable Records for each key's value.
 *
 * @param  {Object} source
 * @param  {Immutable.Record} ImmutableRecord
 * @return {Immutable.Map}
 */
const makeImmutable = (source, ImmutableRecord) => {
  if (source && Object.keys(source).length) {
    return ImmutableMap(Object.keys(source).map(
      key => {
        const record = source[key];
        if (Array.isArray(record)) {
          return [key, Seq(record.map(item => new ImmutableRecord(item)))];
        }
        return [key, new ImmutableRecord(record)];
      }
    ));
  }
  return ImmutableMap({});
};

/**
 * Reduce an array of Objects into an Object keyed on one of the Object's
 * values.
 *
 * @param {Array.<Object>} data
 * @param {Object} options
 * @param {?boolean} [options.replace=false] [description]
 * @param {!string} options.key
 * @return {Object}
 */
const keyReduce = (data, options) => {
  // options defaults
  options = Object.assign({replace: false}, options);
  const {replace, key} = options;
  const keyFunc = typeof key === 'function' ? key : item => item[key];
  return data.reduce((reduced, item) => {
    const itemKey = keyFunc(item);
    if (typeof reduced[itemKey] === 'undefined' && !replace) {
      reduced[itemKey] = [];
    }
    if (replace) {
      reduced[itemKey] = item;
    } else {
      reduced[itemKey].push(item);
    }
    return reduced;
  }, {});
};

const normalizeMetaType = (data, typeName) => {
  let {entities} = normalize(data, arrayOf(metadata));
  let normalized = {};
  normalized[typeName] = makeImmutable(entities.metadata, MetadataRecord);
  return normalized;
};

export const normalizeMetadata = data => {
  const types = keyReduce(data, {key: 'type'});

  const people = normalizeMetaType(types.person || [], 'person');
  const facilities = normalizeMetaType(types.facility || [], 'facility');
  const labTests = normalizeMetaType(types.labtest || [], 'labTest');
  const artifacts = normalizeMetaType(types.artifact || [], 'artifact');
  const statuses = normalizeMetaType(types.status || [], 'status');
  const labRejections = normalizeMetaType(types.rejection || [], 'rejection');

  return ImmutableMap(Object.assign({},
    people, facilities, labTests, artifacts, statuses, labRejections
  ));
};

export const normalizeSamples = ({data, count}) => {
  const {entities, result} = normalize(data, arrayOf(sample));
  const samples = makeImmutable(entities.samples, SampleRecord);
  const sampleIds = Seq(result);
  return {samples, sampleIds, count};
};

export const normalizeSample = data => {
  const artifactChanges = (
    data.Artifacts ?
    data.Artifacts.map(ref => ref.Changes)
      .reduce((reduced, next) => reduced.concat(next), []) :
    []);
  const testChanges = (
    data.LabTests ?
    data.LabTests.map(ref => ref.Changes)
      .reduce((reduced, next) => reduced.concat(next), []) :
    []);

  const changesByArtifactId = makeImmutable(keyReduce(artifactChanges,
                                         {key: 'artifact'}), ChangeRecord);
  const changesByLabTestId = makeImmutable(keyReduce(testChanges,
                                        {key: 'labTest'}), ChangeRecord);

  const {entities, result} = normalize(data, sampleInclude);
  const sampleId = result || null;

  // TODO: do this sort this on the server
  const changesRaw = makeImmutable(entities.changes, ChangeRecord);
  const changes = changesRaw.sortBy(change => change.statusDate);

  const artifacts = makeImmutable(entities.artifactChanges, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestChanges, LabTestRecord);
  const samples = makeImmutable(entities.sampleIncludes, SampleRecord);
  return {samples, sampleId, changes, artifacts, labTests,
          changesByArtifactId, changesByLabTestId};
};

export const normalizeChanges = ({data, count}) => {
  const {entities, result} = normalize(data, arrayOf(changeInclude));
  const changes = makeImmutable(entities.changeIncludes, ChangeRecord);
  const changeIds = Seq(result);
  const artifacts = makeImmutable(entities.artifactSamples, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestSamples, LabTestRecord);
  const samples = makeImmutable(entities.samples, SampleRecord);
  return {changes, changeIds, artifacts, labTests, samples, count};
};
