import {compose} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {LocationFilters} from '../components/DashboardControls';
import {
  getMetaRegions, getFilteredMetaFacilities
} from '../selectors/metadataselectors';
import {withAppRouter} from '../components/Utils';

export const LocationFilterContainer = compose(
  connect(
    state => ({
      isReady: state.isMetadataAvailable,
      filterFacilityKey: state.summaryFilter.get('facilityKey', null),
      filteredMetaFacilities: getFilteredMetaFacilities(state),
      filterRegionKey: state.summaryFilter.get('regionKey', null),
      metaFacilitiesByKey: state.metaRegionsByKey,
      metaRegions: getMetaRegions(state),
      metaRegionsByKey: state.metaRegionsByKey,
    }),
    {changeSummaryFilter}),

  withAppRouter,

)(LocationFilters);

export default LocationFilterContainer;
