import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {LocationFilters} from '../components/DashboardControls';
import {
  getMetaRegions, getFilteredMetaFacilities
} from '../selectors/metadataselectors';
import {getIsLoading} from '../selectors/uiselectors';

export const LocationFilterContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    metaRegionsByKey: state.metaRegionsByKey,
    metaFacilitiesByKey: state.metaRegionsByKey,
    filterRegionKey: state.summaryFilter.get('regionKey', null),
    filterFacilityKey: state.summaryFilter.get('facilityKey', null),
    metaRegions: getMetaRegions(state),
    filteredMetaFacilities: getFilteredMetaFacilities(state)
  }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(LocationFilters);

export default LocationFilterContainer;
