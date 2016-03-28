'use strict';

import {
  FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
  FETCH_METADATA, FETCH_METADATA_FAILURE, RECEIVE_METADATA,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  FETCH_SUMMARY, FETCH_SUMMARY_FAILURE, RECEIVE_SUMMARY,
  CHANGE_WINDOW_SIZE, CHANGE_SUMMARY_FILTER
} from './actions.js';
import * as api from '../api';
import {WindowSize, SummaryFilter, SummaryTotal} from '../api/records.js';

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
  samples, sampleId, changes, artifacts, labTests,
  changesByArtifactId, changesByLabTestId, changesIdsByStage
}) => ({
  type: RECEIVE_SAMPLE_DETAIL,
  samples, sampleId, changes, artifacts, labTests,
  changesByArtifactId, changesByLabTestId, changesIdsByStage
});

const requestChanges = page => ({type: FETCH_CHANGES, page});

const fetchChangesFailure = (error, page) => ({
  type: FETCH_CHANGES_FAILURE,
  error,
  prevPageNumber: page
});

export const fetchChanges = page => {
  page = Number.parseInt(page || 1);
  return dispatch => {
    dispatch(requestChanges(page));
    return api.getChanges({page: page}, (err, data) => {
      if (err) {
        dispatch(fetchChangesFailure(err, page));
      }
      dispatch(receiveChanges(data));
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

const requestSummary = (summaryFilter) => ({type: FETCH_SUMMARY, summaryFilter});

const fetchSummaryFailure = (error) => ({
  type: FETCH_SUMMARY_FAILURE,
  error
});

const receiveSummary = ({
  artifacts, labTests, totals
}) => ({
  type: RECEIVE_SUMMARY,
  artifacts,
  labTests,
  totals: new SummaryTotal(totals)
});

export const fetchSummary = (summaryFilter) => {

  //validity checking for region / facility here?

  return dispatch => {
    dispatch(requestSummary(summaryFilter));

    return api.getSummary(summaryFilter, (err, data) => {
      if (err) {
        dispatch(fetchSummaryFailure(err));
      }
      console.log(data);
      dispatch(receiveSummary(data));
    });
  };
};

export const changeSummaryFilter = (afterDate, beforeDate, regionKey, facilityKey) => ({
  type: CHANGE_SUMMARY_FILTER,
  summaryFilter: new SummaryFilter({afterDate, beforeDate, regionKey, facilityKey})
});
