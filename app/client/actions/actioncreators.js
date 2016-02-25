'use strict';

import {
  FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
  FETCH_METADATA, FETCH_METADATA_FAILURE, RECEIVE_METADATA,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  CHANGE_WINDOW_SIZE
} from './actions.js';
import * as api from '../api';
import {WindowSize} from '../api/records.js';

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

const requestSample = sampleId => ({
  type: FETCH_SAMPLE_DETAIL,
  detailSampleId: sampleId
});

const fetchSampleDetailFailure = error => ({
  type: FETCH_SAMPLE_DETAIL_FAILURE,
  error
});

export const fetchSampleDetail = sampleId => {
  return dispatch => {
    // dispatch(fetchingData(true));
    dispatch(requestSample(sampleId));
    return api.getSampleDetail({sampleId}, (err, data) => {
      if (err) {
        dispatch(fetchSampleDetailFailure(err));
      }
      dispatch(receiveSampleDetail(data));
    });
  };
};

const receiveSampleDetail = ({
  samples, sampleId, changes, artifacts, labTests
}) => ({
  type: RECEIVE_SAMPLE_DETAIL,
  samples, sampleId, changes, artifacts, labTests
});

// const requestSamples = () => ({type: FETCH_SAMPLE_LIST});

// const fetchSamplesFailure = error => ({type: FETCH_SAMPLE_LIST_FAILURE, error});

// const receiveSamples = (samples, sampleIds) => ({
//   type: RECEIVE_SAMPLE_LIST,
//   samples,
//   sampleIds
// });

// export const fetchSamples = () => {
//   return dispatch => {
//     dispatch(fetchingData(true));
//     dispatch(requestSamples());
//     return api.getSamples((err, data) => {
//       if (err) {
//         dispatch(fetchSamplesFailure(err));
//       } else {
//         dispatch(receiveSamples(data.samples, data.sampleIds));
//       }
//       dispatch(fetchingData(false));
//     });
//   };
// };

const requestChanges = page => ({type: FETCH_CHANGES, page});

const fetchChangesFailure = (error, page) => ({
  type: FETCH_CHANGES_FAILURE,
  error,
  prevPageNumber: page
});

export const fetchChanges = page => {
  page = Number.parseInt(page || 1);
  return dispatch => {
    // dispatch(fetchingData(true));
    dispatch(requestChanges(page));
    return api.getChanges({page: page}, (err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err, page));
      }
      dispatch(receiveChanges(data));
      // dispatch(fetchingData(false));
    });
  };
};

const receiveChanges = ({
  changes, changeIds, artifacts, labTests, samples, count
}) => ({
  type: RECEIVE_CHANGES,
  changes, artifacts, labTests, samples, count, changeIds
});

export const changeWindowSize = (innerWidth, innerHeight) => ({
  type: CHANGE_WINDOW_SIZE,
  size: new WindowSize({innerWidth, innerHeight})
});
