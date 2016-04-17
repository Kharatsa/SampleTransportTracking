import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {LocationFilters} from '../components/SummaryControls';
import {
  getMetaRegions, getFilteredMetaFacilities
} from '../selectors/metadataselectors';

export const LocationFilterContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
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
