'use strict';

import {Schema, arrayOf} from 'normalizr';

export const sample = new Schema('samples', {idAttribute: 'uuid'});
export const change = new Schema('changes', {idAttribute: 'uuid'});
export const metadata = new Schema('metadata', {idAttribute: 'key'});

export const changeInclude = new Schema(
  'changeIncludes', {idAttribute: 'uuid'});
export const labTestSample = new Schema(
  'labTestSamples', {idAttribute: 'uuid'});
export const artifactSample = new Schema(
  'artifactSamples', {idAttribute: 'uuid'});

changeInclude.define({
  LabTest: labTestSample,
  Artifact: artifactSample
});

labTestSample.define({
  SampleId: sample
});

artifactSample.define({
  SampleId: sample
});

export const sampleInclude = new Schema(
  'sampleIncludes', {idAttribute: 'uuid'});
export const artifactChange = new Schema(
  'artifactChanges', {idAttribute: 'uuid'});
export const labTestChange = new Schema(
  'labTestChanges', {idAttribute: 'uuid'});

artifactChange.define({
  Changes: arrayOf(change)
});

labTestChange.define({
  Changes: arrayOf(change)
});

sampleInclude.define({
  Artifacts: arrayOf(artifactChange),
  LabTests: arrayOf(labTestChange)
});
