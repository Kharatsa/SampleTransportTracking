import {connect} from 'react-redux';
import {SummaryCounts} from '../components';

export const SummaryCountsContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
    numSampleIds: state.summaryTotalSampleIds,
    numArtifacts: state.summaryTotalArtifacts,
    numLabTests: state.summaryTotalLabTests
  })
)(SummaryCounts);

export default SummaryCountsContainer;
