import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import StageSampleIdCounts from './StageSampleIdCounts';
import StageArtifactCounts from './StageArtifacts/StageArtifactCounts';
import StageLabCounts from './StageLabCounts';

export const StageCounts = ({
      metaStages, sampleIdsStageCounts,
      metaArtifacts, artifactStageCounts,
      metaStatuses, metaLabTests, labTestCounts
}) => {
  return (
    <div className='pure-g'>
      <div className='pure-u-1 pure-u-lg-1-2'>
        <StageArtifactCounts
          metaStages={metaStages}
          metaArtifacts={metaArtifacts}
          artifactStageCounts={artifactStageCounts}
        />
      </div>
      <div className='pure-u-1 pure-u-lg-1-2'>
        <StageSampleIdCounts
          metaStages={metaStages}
          sampleIdsStageCounts={sampleIdsStageCounts}
        />
      </div>
      <div className='pure-u-1'>
        <StageLabCounts
          metaStatuses={metaStatuses}
          metaLabTests={metaLabTests}
          labTestCounts={labTestCounts}
        />
      </div>
    </div>
  );
};

StageCounts.propTypes = {
  artifactStageCounts: PropTypes.instanceOf(List).isRequired,
  fetchSummary: PropTypes.func.isRequired,
  labTestCounts: PropTypes.instanceOf(List).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap),
  metaStages: PropTypes.instanceOf(ImmutableMap),
  metaStatuses: PropTypes.instanceOf(ImmutableMap),
  metaLabTests: PropTypes.instanceOf(ImmutableMap),
  sampleIdsStageCounts: PropTypes.instanceOf(List).isRequired,
  summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
};

export default StageCounts;
