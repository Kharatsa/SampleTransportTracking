'use strict';

import {Schema} from 'normalizr';

export const change = new Schema('changes', {idAttribute: 'uuid'});
export const sample = new Schema('samples', {idAttribute: 'uuid'});
export const labTest = new Schema('labTests', {idAttribute: 'uuid'});
export const artifact = new Schema('artifacts', {idAttribute: 'uuid'});

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
