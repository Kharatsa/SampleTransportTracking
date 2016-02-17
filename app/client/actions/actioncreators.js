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

const fetchSamplesFailure = error => ({type: FETCH_SAMPLES_FAILURE, error});

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

const requestChanges = page => ({type: FETCH_CHANGES, page});

export const fetchChanges = page => {
  page = page || 1;
  return dispatch => {
    dispatch(fetchingData(true));
    dispatch(requestChanges(page));
    return api.getChanges({page: page}, (err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err, page));
      } else {
        dispatch(receiveChanges(data, data.count, data.changeIds));
      }
      dispatch(fetchingData(false));
    });
  };
};

const fetchChangesFailure = (error, page) => ({
  type: FETCH_CHANGES_FAILURE,
  error,
  prevPageNumber: page
});

const receiveChanges = (entities, count, changeIds) => ({
  type: RECEIVE_CHANGES,
  entities,
  count,
  changeIds
});

export const changeWindowSize = (innerWidth, innerHeight) => ({
  type: CHANGE_WINDOW_SIZE,
  size: new WindowSize({innerWidth, innerHeight})
});
