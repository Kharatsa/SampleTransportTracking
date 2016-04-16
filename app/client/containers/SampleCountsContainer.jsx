import {connect} from 'react-redux';
import {SampleCounts} from '../components';

export const SampleCountsContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
    numSampleIds: state.summaryTotalSampleIds,
    numArtifacts: state.summaryTotalArtifacts,
    numLabTests: state.summaryTotalLabTests
  })
)(SampleCounts);

export default SampleCountsContainer;
