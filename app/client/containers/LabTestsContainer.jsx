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
  callOnMount(function() { this.props.fetchSummary(); }),
  waitOnReady,
  callOnProps(
    function(nextProps) {
      nextProps.fetchSummary(nextProps.summaryFilter);
    },
    function(nextProps) {
      this.props.summaryFilter !== nextProps.summaryFilter;
    },
  ),
)(LabTestCounts);

export default LabTestsContainer;
