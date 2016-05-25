import {createSelector} from 'reselect';

const getIsFetchingData = (state) => state.isFetchingData;
const getMetaStages = (state) => state.metaStagesByKey;
const getMetaStatuses = (state) => state.metaStatusesByKey;
const getMetaArtifacts = (state) => state.metaArtifactsByKey;
const getMetaLabTests = (state) => state.metaLabTestsByKey;
const getMetaFacilities = (state) => state.metaFacilitiesByKey;
const getMetaPeople = (state) => state.metaPeopleByKey;

export const getIsMetaLoading = createSelector(
  [
    getMetaStages,
    getMetaStatuses,
    getMetaArtifacts,
    getMetaLabTests,
    getMetaFacilities,
    getMetaPeople
  ],
  (stages, statuses, artifacts, tests, facilities, people) =>
    stages === null ||
    statuses === null ||
    artifacts === null ||
    tests === null ||
    facilities === null ||
    people === null
);

export const getIsLoading = createSelector(
  [getIsMetaLoading, getIsFetchingData],
  (isFetchingData, isMetaLoading) => isFetchingData || isMetaLoading
);
