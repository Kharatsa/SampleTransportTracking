'use strict';

import {createSelector} from 'reselect';
import {Seq} from 'immutable';

const getMetaFacilitiesByKey = (state) => state.metaFacilitiesByKey;
const getSummaryFilter = (state) => state.summaryFilter;
const getMetaRegionsByKey = (state) => state.metaRegionsByKey;

// Filter the facilities by the filter's regionKey value. When no regionKey is
// specified in the filter, return an empty sequence (as opposed to
// all facilities).
export const getFilteredMetaFacilities = createSelector(
  [getMetaFacilitiesByKey, getSummaryFilter],
  (facilitiesByKey, summaryFilter) => {
    const regionKey = summaryFilter.get('regionKey');
    if (regionKey !== null) {
      return facilitiesByKey.valueSeq().filter((value) =>
        value.get('region') === regionKey);
    }
    return Seq();
  }
);

// The summary filters won't affect the regions, but a regions selector is
// provided here for a common interface with facilities
export const getMetaRegions = createSelector(
  [getMetaRegionsByKey],
  (metaRegionsByKey) => metaRegionsByKey.valueSeq()
);
