import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {List} from 'immutable';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import StageDatesChart from './StageDatesChart';

const StageDatesChartWrapped = WaitOnFetch(StageDatesChart);

export const StageDatesCounts = React.createClass({
  propTypes: {
    summaryFilter: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    stageDates: PropTypes.instanceOf(List).isRequired,
    stageCountsChartData: PropTypes.arrayOf(PropTypes.shape({
      stage: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number)
    })).isRequired
  },

  mixins: [PureRenderMixin],

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
    const {stageDates, stageCountsChartData} = this.props;

    return (
      <div>
        <StageDatesChartWrapped
          stageDates={stageDates}
          stageCountsChartData={stageCountsChartData}
        />
      </div>
      );
  }
});

export default StageDatesCounts;
