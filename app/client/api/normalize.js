'use strict';

import {arrayOf, normalize} from 'normalizr';
import {Map as ImmutableMap, Seq} from 'immutable';
import {
  changeInclude, sample, metadata, sampleInclude
} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord, MetadataRecord
} from './records.js';

const makeImmutable = (obj, ImmutableRecord) => {
  if (obj && Object.keys(obj).length) {
    return ImmutableMap(Object.keys(obj).map(
      key => [key, new ImmutableRecord(obj[key])]
    ));
  }
  return ImmutableMap({});
};

const keyReduce = metadata => {
  return metadata.reduce((previous, current) => {
    const type = current.type;
    if (!previous[type]) {
      previous[type] = [];
    }
    previous[type].push(current);
    return previous;
  }, {});
};

const normalizeMetaType = (data, typeName) => {
  let {entities} = normalize(data, arrayOf(metadata));
  let normalized = {};
  normalized[typeName] = makeImmutable(entities.metadata, MetadataRecord);
  return normalized;
};

export const normalizeMetadata = data => {
  const types = keyReduce(data);

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
  const {entities, result} = normalize(data, sampleInclude);
  // TODO: do this sort this on the server
  const changesRaw = makeImmutable(entities.changes, ChangeRecord);
  const changes = changesRaw.sortBy(change => change.statusDate);
  const artifacts = makeImmutable(entities.artifactChanges, ArtifactRecord);
  const labTests = makeImmutable(entities.labTestChanges, LabTestRecord);
  const samples = makeImmutable(entities.sampleIncludes, SampleRecord);
  // const sample = SampleRecord(entities.sampleIncludes[result]);
  return {samples, sampleId: result, changes, artifacts, labTests};
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
