import {createSelector} from 'reselect';
import {allTrue} from '../util/arrays';

const getIsMetadataAvailable = state => state.isMetadataAvailable;
const getIsChangesAvailable = state => state.isChangesAvailable;
const getIsSummaryAvailable = state => state.isSummaryAvailable;
const getIsDateSummaryAvailable = state => state.isDateSummaryAvailable;
const getIsTATAvailable = state => state.isTATAvailable;
const getIsSampleDetailAvailable = state => state.isSampleDetailAvailable;
const getPaginationPage = state => state.paginationPage;

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

export const getIsSampleDetailReady = createSelector(
  getIsMetadataAvailable,
  getIsSampleDetailAvailable,
  allTrue,
);

export const getCurrentPage = createSelector(
  getPaginationPage,
  page => page.get('current', null));
