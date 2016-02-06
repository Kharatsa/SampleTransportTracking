'use strict';

import request from '../util/request.js';
import {Schema, normalize, arrayOf} from 'normalizr';
import {Record, Map as ImmutableMap, Set as ImmutableSet} from 'immutable';

const change = new Schema('changes', {idAttribute: 'uuid'});
const sample = new Schema('samples', {idAttribute: 'uuid'});
const labTest = new Schema('labTests', {idAttribute: 'uuid'});
const artifact = new Schema('artifacts', {idAttribute: 'uuid'});

change.define({
  LabTest: labTest,
  Artifact: artifact
});

labTest.define({
  SampleId: sample
});

artifact.define({
  SampleId: sample
});

const ChangeRecord = Record({
  uuid: null,
  statusDate: null,
  stage: null,
  artifact: null,
  labTest: null,
  facility: null,
  person: null,
  status: null,
  labRejection: null,
  createdAt: null,
  updatedAt: null
});

const ArtifactRecord = Record({
  uuid: null,
  sampleId: null,
  artifactType: null,
  createdAt: null,
  updatedAt: null
});

const LabTestRecord = Record({
  uuid: null,
  sampleId: null,
  testType: null,
  createdAt: null,
  updatedAt: null
});

const SampleRecord = Record({
  uuid: null,
  stId: null,
  labId: null,
  outstanding: true,
  createdAt: null,
  updatedAt: null
});

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
      callback(err);
    }

    const {entities, result} = normalize(res.json, arrayOf(sample));
    const samples = makeImmutable(entities.samples, SampleRecord);
    const sampleIds = ImmutableSet(result);
    callback(null, {samples, sampleIds});
  });
};

export const getChanges = callback => {
  return request('/stt/changes', (err, res) => {
    if (err) {
      callback(err);
    }

    const {entities, result} = normalize(res.json, arrayOf(change));
    const changes = makeImmutable(entities.changes, ChangeRecord);
    const artifacts = makeImmutable(entities.artifacts, ArtifactRecord);
    const labTests = makeImmutable(entities.labTests, LabTestRecord);
    const samples = makeImmutable(entities.samples, SampleRecord);
    const changeIds = ImmutableSet(result);
    callback(null, {changes, artifacts, labTests, samples, changeIds});
  });
};
