import {createSelector} from 'reselect';
import {Seq} from 'immutable';

const getMetaFacilitiesKey = (state) => state.metaFacilitiesKeys;
const getMetaFacilitiesByKey = (state) => state.metaFacilitiesByKey;
const getSummaryFilter = (state) => state.summaryFilter;
const getMetaRegionsKeys = (state) => state.metaRegionsKeys;
const getMetaRegionsByKey = (state) => state.metaRegionsByKey;

// Filter the facilities by the filter's regionKey value. When no regionKey is
// specified in the filter, return an empty sequence (as opposed to
// all facilities).
export const getFilteredMetaFacilities = createSelector(
  [getMetaFacilitiesKey, getMetaFacilitiesByKey, getSummaryFilter],
  (facilitiyKeys, facilitiesByKey, summaryFilter) => {
    const regionKey = summaryFilter.get('regionKey');
    if (regionKey !== null) {
      return (
        facilitiyKeys
        .map(key => facilitiesByKey.get(key))
        .filter(facility => facility.get('region') === regionKey));
    }
    return Seq();
  }
);

// The summary filters won't affect the regions, but a regions selector is
// provided here for a common interface with facilities
export const getMetaRegions = createSelector(
  [getMetaRegionsKeys, getMetaRegionsByKey], (regionKeys, regionsByKey) => {
    if (regionKeys) {
      return regionKeys.map(key => regionsByKey.get(key));
    }
    return Seq([]);
  });
