'use strict';

import {combineReducers} from 'redux';
import {Seq, Map as ImmutableMap} from 'immutable';
import {
    FETCH_CHANGES, FETCH_CHANGES_FAILURE, RECEIVE_CHANGES,
    FETCH_SAMPLE_DETAIL, FETCH_SAMPLE_DETAIL_FAILURE, RECEIVE_SAMPLE_DETAIL,
    RECEIVE_METADATA, CHANGE_WINDOW_SIZE
} from '../actions/actions.js';
import {WindowSize, Page} from '../api/records.js';

const isFetchingData = (state=true, action) => {
  switch (action.type) {
  case FETCH_CHANGES:
  case FETCH_SAMPLE_DETAIL:
    return true;
  case FETCH_CHANGES_FAILURE:
  case FETCH_SAMPLE_DETAIL_FAILURE:
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return false;
  default:
    return state;
  }
};

const metadata = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_METADATA:
    return action.metadata;
  default:
    return state;
  }
};

const selectedSampleId = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return action.sampleId;
  default:
    return state;
  }
};

const sampleIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_SAMPLE_DETAIL:
    return Seq([action.sampleId]);
  case RECEIVE_CHANGES:
    return action.samples.keySeq();
  default:
    return state;
  }
};

const samplesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.samples;
  default:
    return state;
  }
};

const changeIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changeIds;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes.keySeq();
  default:
    return state;
  }
};

const changesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changes;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes;
  default:
    return state;
  }
};

const changesTotal = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.count;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes.size;
  default:
    return state;
  }
};

const artifactIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.artifacts.keySeq();
  default:
    return state;
  }
};

const artifactsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.artifacts;
  default:
    return state;
  }
};

const labTestIds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.labTests.keySeq();
  default:
    return state;
  }
};

const labTestsById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.labTests;
  default:
    return state;
  }
};

const changesByArtifactId = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByArtifactId;
  default:
    return state;
  }
};

const changesByLabTestId = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByLabTestId;
  default:
    return state;
  }
};

const changesIdsByStage = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesIdsByStage;
  default:
    return state;
  }
};

const windowSize = (state=new WindowSize({}), action) => {
  switch (action.type) {
  case CHANGE_WINDOW_SIZE:
    return action.size;
  default:
    return state;
  }
};

const page = (state=Page({}), action) => {
  switch (action.type) {
  case FETCH_CHANGES:
    return Page({last: state.current, current: action.page});
  case FETCH_CHANGES_FAILURE:
    return Page({current: state.last});
  default:
    return state;
  }
};

export default combineReducers({
  page,
  windowSize,
  isFetchingData,
  metadata,
  selectedSampleId,
  sampleIds,
  samplesById,
  changeIds,
  changesById,
  changesTotal,
  artifactIds,
  artifactsById,
  changesByArtifactId,
  labTestIds,
  labTestsById,
  changesByLabTestId,
  changesIdsByStage
});
