import {connect} from 'react-redux';
import {fetchDateSummary} from '../actions/actioncreators';
import {getIsLoading} from '../selectors/uiselectors';
import {getStageCountsChartData} from '../selectors/dashboardselectors';
import {StageDatesCounts} from '../components';

export const StageDatesCountsContainer = connect(
  state => ({
    isLoading: getIsLoading(state),
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    stageDates: state.summaryStageCountsDates,
    stageCountsChartData: getStageCountsChartData(state)
  }),
  {fetchDateSummary}
)(StageDatesCounts);

export default StageDatesCountsContainer;
