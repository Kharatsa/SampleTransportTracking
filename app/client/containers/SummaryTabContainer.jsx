import {connect} from 'react-redux';
import {SummaryTabs} from '../components';

export const SummaryTabsContainer = connect(
  state => ({
    isFetchingData: state.isFetchingData,
    numSampleIds: state.summaryTotalSampleIds,
    numArtifacts: state.summaryTotalArtifacts,
    numLabTests: state.summaryTotalLabTests
  })
)(SummaryTabs);

export default SummaryTabsContainer;
