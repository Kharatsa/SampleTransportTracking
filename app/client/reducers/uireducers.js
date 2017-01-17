import * as actions from '../actions/actions.js';

const makeReducer = (fetch, receive) => {
  return (state=false, action) => {
    switch (action.type) {
    case fetch:
      return false;
    case receive:
      return true;
    default:
      return state;
    }
  };
};

export const isChangesAvailable = makeReducer(
  actions.FETCH_CHANGES, actions.RECEIVE_CHANGES);

export const isSampleDetailAvailable = makeReducer(
  actions.FETCH_SAMPLE_DETAIL, actions.RECEIVE_SAMPLE_DETAIL);

export const isSummaryAvailable = makeReducer(
  actions.FETCH_SUMMARY, actions.RECEIVE_SUMMARY);

export const isDateSummaryAvailable = makeReducer(
  actions.FETCH_DATE_SUMMARY, actions.RECEIVE_DATE_SUMMARY);

export const isTATAvailable = makeReducer(
  actions.FETCH_TURN_AROUNDS, actions.RECEIVE_TURN_AROUNDS);

export const isMetadataAvailable = makeReducer(
  actions.FETCH_METADATA, actions.RECEIVE_METADATA);

export const isUsersAvailable = makeReducer(
  actions.FETCH_USERS, actions.RECEIVE_USERS);
