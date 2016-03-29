'use strict';

import {Schema} from 'normalizr';

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
