'use strict';

import request from '../util/request.js';
import {Map as ImmutableMap, OrderedSet} from 'immutable';
import {arrayOf, normalize} from 'normalizr';
import {change, sample, metadata} from './schemas.js';
import {
  ChangeRecord, SampleRecord, ArtifactRecord, LabTestRecord, MetadataRecord
} from './records.js';

const makeImmutable = (obj, ImmutableRecord) => {
  if (obj && Object.keys(obj).length) {
    return ImmutableMap(Object.keys(obj).map(
      key => [key, new ImmutableRecord(obj[key])]
    ));
  }
  return null;
};

export const getSamples = callback => {
  return request('/stt/ids', (err, res) => {
    if (err) {
      return callback(err);
    }

    const {data, count} = res.json;
    const {entities, result} = normalize(data, arrayOf(sample));
    const samples = makeImmutable(entities.samples, SampleRecord);
    const sampleIds = OrderedSet(result);
    callback(null, {samples, sampleIds, count});
  });
};

export const getChanges = callback => {
  return request('/stt/changes', (err, res) => {
    if (err) {
      return callback(err);
    }

    const {data, count} = res.json;
    const {entities, result} = normalize(data, arrayOf(change));
    const changes = makeImmutable(entities.changes, ChangeRecord);
    const changeIds = OrderedSet(result);
    const artifacts = makeImmutable(entities.artifacts, ArtifactRecord);
    const labTests = makeImmutable(entities.labTests, LabTestRecord);
    const samples = makeImmutable(entities.samples, SampleRecord);
    callback(null, {changes, changeIds, artifacts, labTests, samples, count});
  });
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

export const getMetadata = callback => {
  return request('/stt/meta', (err, res) => {
    if (err) {
      return callback(err);
    }

    const types = keyReduce(res.json);

    const people = normalizeMetaType(types.person, 'person');
    const facilities = normalizeMetaType(types.facility, 'facility');
    // TODO: needed?
    // const regions = normalizeMetaType(types.region, 'regions');
    const labTests = normalizeMetaType(types.labtest, 'labTest');
    const artifacts = normalizeMetaType(types.artifact, 'artifact');
    const statuses = normalizeMetaType(types.status, 'status');
    const labRejections = normalizeMetaType(types.rejection, 'rejection');

    const metadata = ImmutableMap(Object.assign({},
      people, facilities, labTests, artifacts, statuses, labRejections
    ));

    callback(null, metadata);
  });
};
