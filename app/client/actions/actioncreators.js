'use strict';

import {
  FETCHING_DATA,
  FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
  RECEIVE_ARTIFACTS, RECEIVE_LAB_TESTS,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES
} from './actions.js';
import {Set as ImmutableSet} from 'immutable';
import {getChanges, getSamples} from '../api';

export const fetchingData = isFetching => ({type: FETCHING_DATA, isFetching});

const requestSamples = () => ({type: FETCH_SAMPLES});

export const fetchSamples = () => {
  return dispatch => {
    dispatch(fetchingData(true));
    dispatch(requestSamples());
    return getSamples((err, data) => {
      if (err) {
        dispatch(fetchSamplesFailure(err));
      } else {
        dispatch(receiveSamples(data.samples, data.sampleIds));
      }
      dispatch(fetchingData(false));
    });
  };
};

const fetchSamplesFailure = err => ({type: FETCH_SAMPLES_FAILURE, error: err});

const receiveSamples = (samples, sampleIds=ImmutableSet()) => ({
  type: RECEIVE_SAMPLES,
  samples,
  sampleIds
});

const requestChanges = () => ({type: FETCH_CHANGES});

export const fetchChanges = () => {
  return dispatch => {
    dispatch(fetchingData(true));
    dispatch(requestChanges());
    return getChanges((err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err));
      } else {
        dispatch(receiveChanges(data.changes, data.changeIds));
        dispatch(receiveSamples(data.samples));
        dispatch(receiveArtifacts(data.artifacts));
        dispatch(receiveLabTests(data.labTests));
      }
      dispatch(fetchingData(false));
    });
  };
};

const fetchChangesFailure = err => ({type: FETCH_CHANGES_FAILURE, error: err});

const receiveChanges = (changes, changeIds=ImmutableSet()) => ({
  type: RECEIVE_CHANGES,
  changes,
  changeIds
});

const receiveLabTests = (labTests, labTestIds=ImmutableSet()) => ({
  type: RECEIVE_LAB_TESTS,
  labTests,
  labTestIds
});

const receiveArtifacts = (artifacts, artifactIds=ImmutableSet()) => ({
  type: RECEIVE_ARTIFACTS,
  artifacts,
  artifactIds
});
