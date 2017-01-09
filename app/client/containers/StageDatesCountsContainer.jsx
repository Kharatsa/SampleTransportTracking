import {compose} from 'redux';
import {connect} from 'react-redux';
import {getIsDateSummaryReady} from '../selectors/uiselectors';
import {getStageCountsChartData} from '../selectors/dashboardselectors';
import {StageDatesCounts} from '../components';
import {waitOnReady} from '../components/Utils';

export const StageDatesCountsContainer = compose(
  connect(
    state => ({
      isReady: getIsDateSummaryReady(state),
      metaStages: state.metaStagesByKey,
      stageDates: state.summaryStageCountsDates,
      stageCountsChartData: getStageCountsChartData(state)
    }),
  ),
  waitOnReady,
)(StageDatesCounts);

export default StageDatesCountsContainer;
