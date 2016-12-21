import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import WaitOnFetch from '../WaitOnFetch.jsx';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts from './StageArtifactCounts';
import StageLabCounts from './StageLabCounts';

const WrappedSampleIdCounts = WaitOnFetch(StageSampleIdCounts);
const WrappedArtifactCounts = WaitOnFetch(StageArtifactCounts);
const WrappedLabCounts = WaitOnFetch(StageLabCounts);

export const StageCounts2 = React.createClass({
  propTypes: {
    artifactStageCounts: PropTypes.instanceOf(List).isRequired,
    fetchSummary: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    labTestCounts: PropTypes.instanceOf(List).isRequired,
    metaArtifacts: PropTypes.instanceOf(ImmutableMap),
    metaStages: PropTypes.instanceOf(ImmutableMap),
    metaStatuses: PropTypes.instanceOf(ImmutableMap),
    metaLabTests: PropTypes.instanceOf(ImmutableMap),
    summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
    sampleIdsStageCounts: PropTypes.instanceOf(List).isRequired,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillMount() {
    this._update(this.props.summaryFilter);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.summaryFilter !== this.props.summaryFilter) {
      this._update(nextProps.summaryFilter);
    }
  },

  _update(filter) {
    const {fetchSummary} = this.props;
    fetchSummary(filter);
  },

  render() {
    const {
      isLoading,
      metaStages, sampleIdsStageCounts,
      metaArtifacts, artifactStageCounts,
      metaStatuses, metaLabTests, labTestCounts
    } = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1'>
          <WrappedLabCounts
            isLoading={isLoading}
            metaStatuses={metaStatuses}
            metaLabTests={metaLabTests}
            labTestCounts={labTestCounts}
          />
        </div>
      </div>
    );
  }
});

export default StageCounts2;
