import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {LocationFilters} from '../components/DashboardControls';
import {
  getMetaRegions, getFilteredMetaFacilities
} from '../selectors/metadataselectors';

export const LocationFilterContainer = connect(
  state => ({
    isReady: state.isMetadataAvailable,
    filterFacilityKey: state.summaryFilter.get('facilityKey', null),
    filteredMetaFacilities: getFilteredMetaFacilities(state),
    filterRegionKey: state.summaryFilter.get('regionKey', null),
    metaFacilitiesByKey: state.metaRegionsByKey,
    metaRegions: getMetaRegions(state),
    metaRegionsByKey: state.metaRegionsByKey,
  }),
  {changeSummaryFilter},
)(LocationFilters);

export default LocationFilterContainer;
