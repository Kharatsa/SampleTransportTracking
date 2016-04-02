'use strict';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeSummaryFilter} from '../actions/actioncreators';
import SummaryFilter from '../components/Summary/SummaryFilter';

export const SummaryFilterContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metadata: state.metadata
  }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(SummaryFilter);

export default SummaryFilterContainer;
