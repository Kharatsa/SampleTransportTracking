import {createSelector} from 'reselect';

const getIsMetadataAvailable = state => state.isMetadataAvailable;
const getIsChangesAvailable = state => state.isChangesAvailable;
const getIsSummaryAvailable = state => state.isSummaryAvailable;
const getIsDateSummaryAvailable = state => state.isDateSummaryAvailable;
const getIsTATAvailable = state => state.isTATAvailable;
const getIsSampleDetailAvailable = state => {
  return state.isSampleDetailAvailable;
};
const getPaginationPage = state => state.paginationPage;

const allTrue = (...args) => args.every((arg) => !!arg);

export const getIsChangesReady = createSelector(
  getIsMetadataAvailable,
  getIsChangesAvailable,
  allTrue,
);

export const getIsTATReady = createSelector(
  getIsMetadataAvailable,
  getIsTATAvailable,
  allTrue,
);

export const getIsSummaryReady = createSelector(
  getIsMetadataAvailable,
  getIsSummaryAvailable,
  allTrue,
);

export const getIsDateSummaryReady = createSelector(
  getIsMetadataAvailable,
  getIsDateSummaryAvailable,
  allTrue,
);

export const getIsSampleReady = createSelector(
  getIsMetadataAvailable,
  getIsSampleDetailAvailable,
  (meta, sample) => {
    console.debug(`meta=${meta}, sample=${sample}`);
    return allTrue(meta, sample);
  }
  // allTrue,
);

export const getCurrentPage = createSelector(
  [getPaginationPage],
  page => {
    return page.get('current', null);
  });
