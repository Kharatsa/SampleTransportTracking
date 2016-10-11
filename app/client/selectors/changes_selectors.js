import {createSelector} from 'reselect';
import {dereferenceChanges} from '../components/Changes/prepare.js';

const getters = [
  state => state.changeIds,
  state => state.changesById,
  state => state.labTestsById,
  state => state.artifactsById,
  state => state.samplesById,
];

// Retrieves references to Lab Tests, Artifacts, and Samples in Changes
export const getChangesDetail = createSelector(getters, dereferenceChanges);

export default getChangesDetail;
