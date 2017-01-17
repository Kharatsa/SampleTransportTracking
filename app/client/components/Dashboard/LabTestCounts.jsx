import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import {SummaryFilter} from '../../api/records.js';
import StageLabCounts from './StageLabCounts';

export const LabTestCounts = ({metaStatuses, metaLabTests, labTestCounts}) => {
  return (
    <div className='pure-g'>
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

LabTestCounts.propTypes = {
  artifactStageCounts: PropTypes.instanceOf(List).isRequired,
  fetchSummary: PropTypes.func.isRequired,
  labTestCounts: PropTypes.instanceOf(List).isRequired,
  metaArtifacts: PropTypes.instanceOf(ImmutableMap),
  metaStages: PropTypes.instanceOf(ImmutableMap),
  metaStatuses: PropTypes.instanceOf(ImmutableMap),
  metaLabTests: PropTypes.instanceOf(ImmutableMap),
  summaryFilter: PropTypes.instanceOf(SummaryFilter).isRequired,
};

export default LabTestCounts;
