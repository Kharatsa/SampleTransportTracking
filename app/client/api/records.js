'use strict';

import {Record} from 'immutable';

export const MetadataRecord = Record({
  id: null,
  type: null,
  key: null,
  value: null
});

export const ChangeRecord = Record({
  uuid: null,
  statusDate: null,
  stage: null,
  artifact: null,
  labTest: null,
  facility: null,
  person: null,
  status: null,
  labRejection: null
});

export const ArtifactRecord = Record({
  uuid: null,
  sampleId: null,
  artifactType: null
});

export const LabTestRecord = Record({
  uuid: null,
  sampleId: null,
  testType: null
});

export const SampleRecord = Record({
  uuid: null,
  stId: null,
  labId: null,
  outstanding: true,
  createdAt: null
  // updatedAt: null
});

export const WindowSize = Record({
  innerWidth: 0,
  innerHeight: 0
});

export const Page = Record({
  last: null,
  current: 1
});
