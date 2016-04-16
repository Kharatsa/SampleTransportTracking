import {RECEIVE_SUMMARY, RECEIVE_TURN_AROUNDS} from '../actions/actions.js';
import {Seq} from 'immutable';

export const summaryTotalSampleIds = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.sampleIdsCount;
  default:
    return state;
  }
};

export const summaryTotalArtifacts = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.artifactsCount;
  default:
    return state;
  }
};

export const summaryTotalLabTests = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.labTestsCount;
  default:
    return state;
  }
};

export const summaryArtifacts = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.artifacts;
  default:
    return state;
  }
};

export const summaryLabTests = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.labTests;
  default:
    return state;
  }
};

export const summaryTurnArounds = (state=Seq(), action) => {
  switch (action.type) {
  case RECEIVE_TURN_AROUNDS:
    return action.turnArounds;
  default:
    return state;
  }
};
