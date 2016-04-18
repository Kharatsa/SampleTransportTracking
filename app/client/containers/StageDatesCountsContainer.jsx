import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchDateSummary} from '../actions/actioncreators';
import {getStageCountsChartData} from '../selectors/dashboardselectors';
import {StageDatesCounts} from '../components';

export const StageDatesCountsContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    stageDates: state.summaryStageCountsDates,
    stageCountsChartData: getStageCountsChartData(state)
  }),
  dispatch => ({actions: bindActionCreators({fetchDateSummary}, dispatch)})
)(StageDatesCounts);

export default StageDatesCountsContainer;
