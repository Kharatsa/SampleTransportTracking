import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchSummary} from '../actions/actioncreators';
import {getIsSummaryReady} from '../selectors/uiselectors';
import {
  getArtifactStageCounts,
  getLabTestStatusCounts
} from '../selectors/dashboardselectors';
import {LabTestCounts} from '../components';
import {waitOnReady, callOnMount, callOnProps} from '../components/Utils';

export const LabTestsContainer = compose(
  connect(
    state => ({
      isReady: getIsSummaryReady(state),
      summaryFilter: state.summaryFilter,
      metaStages: state.metaStagesByKey,
      metaArtifacts: state.metaArtifactsByKey,
      artifactStageCounts: getArtifactStageCounts(state),
      metaStatuses: state.metaStatusesByKey,
      metaLabTests: state.metaLabTestsByKey,
      labTestCounts: getLabTestStatusCounts(state)
    }),
    {fetchSummary}),
  callOnMount(({fetchSummary}) => fetchSummary()),
  waitOnReady,
  callOnProps(
    ({fetchSummary}, {summaryFilter}) => fetchSummary(summaryFilter),
    ({summaryFilter}, {summaryFilter: nextSummaryFilter}) => {
      return summaryFilter !== nextSummaryFilter;
    },
  ),
)(LabTestCounts);

export default LabTestsContainer;
