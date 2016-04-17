import {RECEIVE_SUMMARY, RECEIVE_TURN_AROUNDS} from '../actions/actions.js';
import {List} from 'immutable';

export const summaryTotalSampleIds = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.get('sampleIdsCount');
  default:
    return state;
  }
};

export const summaryTotalArtifacts = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.get('artifactsCount');
  default:
    return state;
  }
};

export const summaryTotalLabTests = (state=0, action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.totals.get('labTestsCount');
  default:
    return state;
  }
};

export const summarySampleIds = (state=List(), action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.sampleIds;
  default:
    return state;
  }
};

export const summaryArtifacts = (state=List(), action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.artifacts;
  default:
    return state;
  }
};

export const summaryLabTests = (state=List(), action) => {
  switch (action.type) {
  case RECEIVE_SUMMARY:
    return action.labTests;
  default:
    return state;
  }
};

export const summaryTurnArounds = (state=List(), action) => {
  switch (action.type) {
  case RECEIVE_TURN_AROUNDS:
    return action.turnArounds;
  default:
    return state;
  }
};
