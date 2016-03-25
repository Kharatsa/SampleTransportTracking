import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { changeSummaryFilter } from '../actions/actioncreators';

import SummaryFilter from '../components/Summary/SummaryFilter';

export default connect(
  state => ({ summaryFilter: state.summaryFilter,
              metadata: state.metadata }),
  dispatch => ({actions: bindActionCreators({changeSummaryFilter}, dispatch)})
)(SummaryFilter);
