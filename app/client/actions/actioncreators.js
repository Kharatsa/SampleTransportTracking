'use strict';

import {
  FETCHING_DATA,
  FETCH_SAMPLES, FETCH_SAMPLES_FAILURE, RECEIVE_SAMPLES,
  FETCH_METADATA, FETCH_METADATA_FAILURE, RECEIVE_METADATA,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  CHANGE_WINDOW_SIZE
} from './actions.js';
import {Set as ImmutableSet} from 'immutable';
import * as api from '../api';
import {WindowSize} from '../api/records.js';

export const fetchingData = isFetching => ({type: FETCHING_DATA, isFetching});

const requestMetadata = () => ({type: FETCH_METADATA});

const fetchMetadataFailure = err => ({
  type: FETCH_METADATA_FAILURE, error: err
});

const receiveMetadata = metadata => ({type: RECEIVE_METADATA, metadata});

export const fetchMetadata = () => {
  return dispatch => {
    dispatch(requestMetadata());
    return api.getMetadata((err, data) => {
      if (err) {
        dispatch(fetchMetadataFailure(err));
      } else {
        dispatch(receiveMetadata(data));
      }
    });
  };
};

const requestSamples = () => ({type: FETCH_SAMPLES});

const fetchSamplesFailure = err => ({type: FETCH_SAMPLES_FAILURE, error: err});

const receiveSamples = (samples, sampleIds=ImmutableSet()) => ({
  type: RECEIVE_SAMPLES,
  samples,
  sampleIds
});

export const fetchSamples = () => {
  return dispatch => {
    dispatch(fetchingData(true));
    dispatch(requestSamples());
    return api.getSamples((err, data) => {
      if (err) {
        dispatch(fetchSamplesFailure(err));
      } else {
        dispatch(receiveSamples(data.samples, data.sampleIds));
      }
      dispatch(fetchingData(false));
    });
  };
};

const requestChanges = () => ({type: FETCH_CHANGES});

export const fetchChanges = () => {
  return dispatch => {
    dispatch(fetchingData(true));
    dispatch(requestChanges());
    return api.getChanges((err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err));
      } else {
        dispatch(receiveChanges(data, data.changeIds));
      }
      dispatch(fetchingData(false));
    });
  };
};

const fetchChangesFailure = err => ({type: FETCH_CHANGES_FAILURE, error: err});

const receiveChanges = (entities, changeIds) => ({
  type: RECEIVE_CHANGES,
  entities,
  changeIds
});

export const changeWindowSize = (innerWidth, innerHeight) => ({
  type: CHANGE_WINDOW_SIZE,
  size: new WindowSize({innerWidth, innerHeight})
});
