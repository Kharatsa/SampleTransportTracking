import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import WaitOnFetch from '../WaitOnFetch.jsx';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts2 from './StageArtifactCounts2';
import StageArtifactCounts3 from './StageArtifactCounts3';
import StageLabCounts from './StageLabCounts';

const WrappedSampleIdCounts = WaitOnFetch(StageSampleIdCounts);
const WrappedArtifactCounts = WaitOnFetch(StageArtifactCounts2);
const WrappedArtifactCounts2 = WaitOnFetch(StageArtifactCounts3);
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
        <div className='pure-u-1 pure-u-md-1-2'>
          <WrappedArtifactCounts
            isLoading={isLoading}
            metaStages={metaStages}
            metaArtifacts={metaArtifacts}
            artifactStageCounts={artifactStageCounts}
          />
        </div>
      <div className='pure-u-1 pure-u-md-1-2'>
          <WrappedArtifactCounts2
            isLoading={isLoading}
            metaStages={metaStages}
            metaArtifacts={metaArtifacts}
            artifactStageCounts={artifactStageCounts}
          />
        </div>
      </div>
    );
  }
});

export default StageCounts2;
