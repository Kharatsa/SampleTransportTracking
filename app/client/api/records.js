import {Record} from 'immutable';

export const KeyValueMetaRecord = Record({
  key: null,
  value: null,
  createdAt: null,
  updatedAt: null
});

export const FacilityMetaRecord = Record({
  key: null,
  value: null,
  region: null,
  createdAt: null,
  updatedAt: null
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
  createdAt: null,
  updatedAt: null
});

export const Page = Record({
  last: null,
  current: 1
});

export const SummaryFilter = Record({
  afterDate: null,
  beforeDate: null,
  regionKey: null,
  facilityKey: null
});

export const TurnAround = Record({
  from: null,
  to: null,
  averageTATms: 0
});

export const User = Record({
  id: null,
  username: null,
  isAdmin: false,
  createdAt: null,
  updatedAt: null
});
