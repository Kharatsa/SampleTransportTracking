import React, {PropTypes} from 'react';
import {List} from 'immutable';
import Moment from 'moment';
import Chartist from '../Chartist';

const CHART_OPTIONS = {
  height: '250px',
  stackBars: true,
  reverseData: true,
  horizontalBars: true,
  axisX: {
    labelInterpolationFnc: (value) => {
      const duration = Moment.duration(value).as('hours');
      return duration ? duration.toFixed(0) : '';
    },
    offset: 10
  }
};

export const TurnAroundsChart = ({stagesTATs}) => {
  const totalTAT = (
    stagesTATs
    .map(tat => tat.get('averageTATms'))
    .reduce((r, tat) => r + tat, 0));

  const data = {
    series: stagesTATs.map(tat => [tat.get('averageTATms')]).toArray()
  };

  CHART_OPTIONS.total = totalTAT * 2;

  return (
    <Chartist
      id='tat-chart'
      type='Bar'
      data={data}
      options={CHART_OPTIONS}
    />
  );
};

TurnAroundsChart.propTypes = {
  stagesTATs: PropTypes.instanceOf(List).isRequired
};

export default TurnAroundsChart;
