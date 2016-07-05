import {createSelector} from 'reselect';

const getIsFetchingData = (state) => state.isFetchingData;
const getIsFetchingMetadata = (state) => state.isFetchingMetadata;

export const getIsLoading = createSelector(
  [getIsFetchingMetadata, getIsFetchingData],
  (isMetaLoading, isFetchingData) => {
    return (isFetchingData || isMetaLoading);
  }
);
