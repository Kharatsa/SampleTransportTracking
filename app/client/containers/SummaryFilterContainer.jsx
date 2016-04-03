'use strict';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import SummaryFilter from '../components/Summary/SummaryFilter';
import {getMetaRegions, getFilteredMetaFacilities} from '../selectors';

export const SummaryFilterContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metaRegions: getMetaRegions(state),
    filteredMetaFacilities: getFilteredMetaFacilities(state)
  }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(SummaryFilter);

export default SummaryFilterContainer;
