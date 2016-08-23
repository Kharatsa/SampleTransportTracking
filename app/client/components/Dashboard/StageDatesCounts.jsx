import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {List} from 'immutable';
import WaitOnFetch from '../WaitOnFetch.jsx';
import StageDatesChart from './StageDatesChart';

const StageDatesChartWrapped = WaitOnFetch(StageDatesChart);

export const StageDatesCounts = React.createClass({
  propTypes: {
    isLoading: PropTypes.bool.isRequired,
    summaryFilter: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    stageDates: PropTypes.instanceOf(List).isRequired,
    stageCountsChartData: PropTypes.arrayOf(PropTypes.shape({
      stage: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number)
    })).isRequired
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
    const {fetchDateSummary} = this.props.actions;
    fetchDateSummary(filter);
  },

  render() {
    const {isLoading, stageDates, stageCountsChartData} = this.props;

    return (
      <StageDatesChartWrapped
        isLoading={isLoading}
        stageDates={stageDates}
        stageCountsChartData={stageCountsChartData}
      />
    );
  }
});

export default StageDatesCounts;
