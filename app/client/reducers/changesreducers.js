import {RECEIVE_CHANGES, RECEIVE_SAMPLE_DETAIL} from '../actions/actions.js';
import {List, Map as ImmutableMap} from 'immutable';

export const changeIds = (state=List(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
  case RECEIVE_SAMPLE_DETAIL:
    return action.changeIds;
  default:
    return state;
  }
};

// TODO: move these re-arranged change objects into selectors (i.e., don't
// re-arrange in normalize)

export const changesByArtifactId = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByArtifactId;
  default:
    return state;
  }
};

export const changesById = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.changes;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes;
  default:
    return state;
  }
};

export const changesByLabTestId = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByLabTestId;
  default:
    return state;
  }
};

export const changesByStage = (state=ImmutableMap(), action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return ImmutableMap();
  case RECEIVE_SAMPLE_DETAIL:
    return action.changesByStage;
  default:
    return state;
  }
};

export const changesTotal = (state=null, action) => {
  switch (action.type) {
  case RECEIVE_CHANGES:
    return action.count;
  case RECEIVE_SAMPLE_DETAIL:
    return action.changes.size;
  default:
    return state;
  }
};
