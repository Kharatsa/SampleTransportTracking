'use strict';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchSummary} from '../actions/actioncreators';
import TotalCounts from '../components/Summary/TotalCounts';

export const TotalCountsContainer = connect(
  state => ({
    summaryFilter: state.summaryFilter,
    metadata: state.metadata,
    summary: state.summary
  }),
  dispatch => ({actions: bindActionCreators({fetchSummary}, dispatch)})
)(TotalCounts);

export default TotalCountsContainer;
