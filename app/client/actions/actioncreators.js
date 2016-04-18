import {
  FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
  FETCH_METADATA, FETCH_METADATA_FAILURE, RECEIVE_METADATA,
  FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
  FETCH_SUMMARY, FETCH_SUMMARY_FAILURE, RECEIVE_SUMMARY,
  FETCH_TURN_AROUNDS, FETCH_TURN_AROUNDS_FAILURE, RECEIVE_TURN_AROUNDS,
  FETCH_DATE_SUMMARY, FETCH_DATE_SUMMARY_FAILURE, RECEIVE_DATE_SUMMARY,
  CHANGE_SUMMARY_FILTER
} from './actions.js';
import * as api from '../api';
import {SummaryFilter} from '../api/records.js';

const requestMetadata = () => ({type: FETCH_METADATA});

const fetchMetadataFailure = err =>
  ({type: FETCH_METADATA_FAILURE, error: err});

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

const requestSample = sampleId =>
  ({type: FETCH_SAMPLE_DETAIL, detailSampleId: sampleId});

const fetchSampleDetailFailure = error =>
  ({type: FETCH_SAMPLE_DETAIL_FAILURE, error});

export const fetchSampleDetail = sampleId => {
  return dispatch => {
    dispatch(requestSample(sampleId));
    return api.getSampleDetail(sampleId, (err, data) => {
      if (err) {
        dispatch(fetchSampleDetailFailure(err));
      }
      dispatch(receiveSampleDetail(data));
    });
  };
};

const getFilterValues = filter => ({
  afterDate: filter.get('afterDate', null),
  beforeDate: filter.get('beforeDate', null),
  regionKey: filter.get('regionKey', null),
  facilityKey: filter.get('facilityKey', null)
});

const receiveSampleDetail = ({
  samples, sampleId, changes, artifacts, labTests,
  changesByArtifactId, changesByLabTestId, changesByStage
}) => ({
  type: RECEIVE_SAMPLE_DETAIL,
  samples, sampleId, changes, artifacts, labTests,
  changesByArtifactId, changesByLabTestId, changesByStage
});

const requestChanges = (summaryFilter, page) =>
  ({type: FETCH_CHANGES, summaryFilter, page});

const fetchChangesFailure = (error, page) =>
  ({type: FETCH_CHANGES_FAILURE, error, prevPageNumber: page});

export const fetchChanges = (summaryFilter, page) => {
  return dispatch => {
    dispatch(requestChanges(summaryFilter, page));
    return api.getChanges(getFilterValues(summaryFilter), page, (err, data) => {
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

const requestSummary = (summaryFilter) =>
  ({type: FETCH_SUMMARY, summaryFilter});

const fetchSummaryFailure = (error) =>
  ({type: FETCH_SUMMARY_FAILURE, error});

const receiveSummary = ({sampleIds, artifacts, labTests, totals}) =>
  ({type: RECEIVE_SUMMARY, sampleIds, artifacts, labTests, totals});

export const fetchSummary = (summaryFilter) => {
  return dispatch => {
    dispatch(requestSummary(summaryFilter));
    return api.getSummary(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchSummaryFailure(err));
      }
      dispatch(receiveSummary(data));
    });
  };
};

const requestTurnArounds = (summaryFilter) =>
  ({type: FETCH_TURN_AROUNDS, summaryFilter});

const fetchTurnAroundsFailure = (error) =>
  ({type: FETCH_TURN_AROUNDS_FAILURE, error});

const receiveTurnArounds = (turnArounds) =>
  ({type: RECEIVE_TURN_AROUNDS, turnArounds});

export const fetchTurnArounds = (summaryFilter) => {
  return dispatch => {
    dispatch(requestTurnArounds(summaryFilter));
    return api.getTurnArounds(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchTurnAroundsFailure(err));
      }
      dispatch(receiveTurnArounds(data));
    });
  };
};

export const changeSummaryFilter = ({
  afterDate, beforeDate, regionKey, facilityKey
}) => ({
  type: CHANGE_SUMMARY_FILTER,
  summaryFilter: new SummaryFilter({
    afterDate, beforeDate, regionKey, facilityKey
  })
});

const requestDateSummary = (summaryFilter) =>
  ({type: FETCH_DATE_SUMMARY, summaryFilter});

const fetchDateSummaryFailure = (error) =>
  ({type: FETCH_DATE_SUMMARY_FAILURE, error});

const receiveDateSummary = data =>
  ({type: RECEIVE_DATE_SUMMARY, ...data});

export const fetchDateSummary = (summaryFilter) => {
  return dispatch => {
    dispatch(requestDateSummary(summaryFilter));
    return api.getStageDates(getFilterValues(summaryFilter), (err, data) => {
      if (err) {
        dispatch(fetchDateSummaryFailure(err));
      }
      dispatch(receiveDateSummary(data));
    });
  };
};
