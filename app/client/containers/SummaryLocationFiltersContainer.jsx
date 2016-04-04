import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import {SummaryLocationFilters} from '../components/SummaryControls';
import {getMetaRegions, getFilteredMetaFacilities} from '../selectors';

export const SummaryLocationFilterContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
    metaRegionsByKey: state.metaRegionsByKey,
    metaFacilitiesByKey: state.metaRegionsByKey,
    summaryFilter: state.summaryFilter,
    metaRegions: getMetaRegions(state),
    filteredMetaFacilities: getFilteredMetaFacilities(state)
  }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(SummaryLocationFilters);

export default SummaryLocationFilterContainer;
