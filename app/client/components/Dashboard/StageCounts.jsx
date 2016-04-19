import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts from './StageArtifactCounts';
import StageLabCounts from './StageLabCounts';

const WrappedSampleIdCounts = WaitOnFetch(StageSampleIdCounts);
const WrappedArtifactCounts = WaitOnFetch(StageArtifactCounts);
const WrappedLabCounts = WaitOnFetch(StageLabCounts);

export const StageCounts = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
    sampleIdsStageCounts: PropTypes.instanceOf(List).isRequired,
    metaArtifacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    artifactStageCounts: PropTypes.instanceOf(List).isRequired,
    metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
    metaLabTests: PropTypes.instanceOf(ImmutableMap).isRequired,
    labTestCounts: PropTypes.instanceOf(List).isRequired
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
    const {fetchSummary} = this.props.actions;
    fetchSummary(filter);
  },

  render() {
    const {
      metaStages, sampleIdsStageCounts,
      metaArtifacts, artifactStageCounts,
      metaStatuses, metaLabTests, labTestCounts
    } = this.props;

    return (
        <div className='pure-g'>
          <div className='pure-u-1 pure-u-lg-1-3'>
            <WrappedSampleIdCounts
              metaStages={metaStages}
              sampleIdsStageCounts={sampleIdsStageCounts}
            />
          </div>
          <div className='pure-u-1 pure-u-lg-1-3'>
            <WrappedArtifactCounts
              metaStages={metaStages}
              metaArtifacts={metaArtifacts}
              artifactStageCounts={artifactStageCounts}
            />
          </div>
          <div className='pure-u-1 pure-u-lg-1-3'>
            <WrappedLabCounts
              metaStatuses={metaStatuses}
              metaLabTests={metaLabTests}
              labTestCounts={labTestCounts}
            />
          </div>
        </div>
    );
  }
});

export default StageCounts;
