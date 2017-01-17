import React, {PropTypes} from 'react';
import {List} from 'immutable';
import StageDatesChart from './StageDatesChart';

export const StageDatesCounts = ({stageDates, stageCountsChartData}) => {
  return (
    <StageDatesChart
      stageDates={stageDates}
      stageCountsChartData={stageCountsChartData}
    />
  );
};

StageDatesCounts.propTypes = {
  stageDates: PropTypes.instanceOf(List).isRequired,
  stageCountsChartData: PropTypes.arrayOf(PropTypes.shape({
    stage: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.number)
  })).isRequired,
};

export default StageDatesCounts;
