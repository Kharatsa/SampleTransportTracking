import React, {PropTypes} from 'react';
import {List} from 'immutable';
import moment from 'moment';
import Chartist from '../Chartist';
import ChartistLib from 'chartist';
import 'chartist-plugin-legend';

const formatDateLabel = date => {
  if (date && date.length) {
    return moment(date).format('YYYY MMM DD');
  }
  return '';
};

const CHART_OPTIONS = {
  stackBars: true,
  plugins: [ChartistLib.plugins.legend()],
  height: '250px',
  axisX: {
    showGrid: false,
    offset: 50,
    labelInterpolationFnc: formatDateLabel
  },
  axisY: {
    onlyInteger: true
  }
};

const TOTAL_LABELS_NUM = 20;

// To avoid crowding of the x-axis, only display a subset of all labels.
const spacedLabels = stageDates => {
  const skipNum = Math.ceil(stageDates.size / TOTAL_LABELS_NUM);

  return stageDates.map((date, i) => {
    if ((i % skipNum) === 0) {
      return date;
    }
    return '';
  });
};

export const StagesChart = ({stageDates, stageCountsChartData}) => {
  const data = {
    labels: spacedLabels(stageDates).toArray(),
    series: stageCountsChartData
  };

  return (
    <Chartist
      type='Bar'
      data={data}
      options={CHART_OPTIONS}
    />
  );
};

StagesChart.propTypes = {
  stageDates: PropTypes.instanceOf(List).isRequired,
  stageCountsChartData: PropTypes.arrayOf(PropTypes.shape({
    stage: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.number)
  })).isRequired
};

export default StagesChart;
