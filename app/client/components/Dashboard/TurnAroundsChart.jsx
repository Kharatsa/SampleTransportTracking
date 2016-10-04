import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import Moment from 'moment';
import Chartist from '../Chartist';
import legend from 'chartist-plugin-legend';
import ctAxisTitle from 'chartist-plugin-axistitle';

const AXIS_TITLE_OPTIONS = {
  axisX: {
    axisTitle: 'Cumulative Avg. Time (days)',
    axisClass: 'ct-axis-title',
    offset: {x: 0, y: 40},
    textAnchor: 'middle'
  },
  axisY: {}
};

const CHART_OPTIONS = {
  plugins: [
    ctAxisTitle(AXIS_TITLE_OPTIONS),
    legend()
  ],
  height: '280px',
  stackBars: true,
  horizontalBars: true,
  axisX: {
    onlyInteger: true,
    offset: 80
  }
};

const descTATElem = (metaStatuses, metaStages, step) => {
  const stageKey = step.stage;
  const statusKey = step.status;

  const stageDesc = (
    typeof stageKey !== 'undefined' ?
    metaStages.get(stageKey).get('value') :
    'N/A'
  );

  const statusDesc = (
    typeof statusKey !== 'undefined' && metaStatuses.get(statusKey) ?
    metaStatuses.get(statusKey).get('value') :
    null
  );

  return statusDesc || stageDesc;
};

export const TurnAroundsChart = ({stagesTATs, metaStages, metaStatuses}) => {
  // Horizontal 1-dimensional bar chart with 1 "y" value per stage
  const data = stagesTATs.map((tat) => {
    const fromDescElem = descTATElem(metaStatuses, metaStages, tat.get('from'));
    const toDescElem = descTATElem(metaStatuses, metaStages, tat.get('to'));

    const msTAT = tat.get('averageTATms');
    const durationVal = Moment.duration(msTAT).as('days');

    return {
      data: [durationVal],
      name: `${fromDescElem} to ${toDescElem}`
    };
  }).toArray();

  return (
    <Chartist
      id='tat-chart'
      type='Bar'
      data={{series: data}}
      options={CHART_OPTIONS}
    />
  );
};

TurnAroundsChart.propTypes = {
  stagesTATs: PropTypes.instanceOf(List).isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired
};

export default TurnAroundsChart;
