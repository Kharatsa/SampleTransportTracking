import {connect} from 'react-redux';
import {fetchDateSummary} from '../actions/actioncreators';
import {getIsDateSummaryReady} from '../selectors/uiselectors';
import {getStageCountsChartData} from '../selectors/dashboardselectors';
import {StageDatesCounts} from '../components';
import {WaitOnReady, CallOnMount} from '../components/Utils';

export const StageDatesCountsContainer = connect(
  state => ({
    isReady: getIsDateSummaryReady(state),
    onMountFunc: 'fetchDateSummary',
    summaryFilter: state.summaryFilter,
    metaStages: state.metaStagesByKey,
    stageDates: state.summaryStageCountsDates,
    stageCountsChartData: getStageCountsChartData(state)
  }),
  {fetchDateSummary}
)(CallOnMount(WaitOnReady(StageDatesCounts)));

export default StageDatesCountsContainer;
