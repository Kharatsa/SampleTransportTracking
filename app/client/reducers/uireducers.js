import * as actions from '../actions/actions.js';

const makeReducer = target => {
  return (state=false, action) => {
    switch (action.type) {
    case target:
      return true;
    default:
      return state;
    }
  };
};

export const isChangesAvailable = makeReducer(actions.RECEIVE_CHANGES);

export const isSampleDetailAvailble = makeReducer(actions.RECEIVE_SAMPLE_DETAIL);

export const isSummaryAvailable = makeReducer(actions.RECEIVE_SUMMARY);

export const isDateSummaryAvailable = makeReducer(actions.RECEIVE_DATE_SUMMARY);

export const isTATAvailable = makeReducer(actions.RECEIVE_TURN_AROUNDS);

export const isMetadataAvailable = makeReducer(actions.RECEIVE_METADATA);

export const isUsersAvailable = makeReducer(actions.RECEIVE_USERS);
