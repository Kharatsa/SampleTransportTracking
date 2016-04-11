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

export const SummaryTotal = Record({
  artifactsCount:null,
  labTestsCount:null,
  sampleIdsCount:null
});

export const ArtifactsCount = Record({
  stage:null,
  status:null,
  artifactType:null,
  sampleIdsCount:0,
  artifactsCount:0
});

export const LabTestsCount = Record({
  status:null,
  testType:null,
  testRejection:null,
  sampleIdsCount:0,
  labTestsCount:0
});

export const TurnAround = Record({
  from:null,
  to:null,
  averageTATms:0
});
