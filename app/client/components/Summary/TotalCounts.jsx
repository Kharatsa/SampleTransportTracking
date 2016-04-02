'use strict';

import React from 'react';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import TotalCountsTable from './TotalCountsTable';

const TotalCountsTableWrapped = WaitOnFetch(TotalCountsTable);

export const TotalCounts = React.createClass({
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
    return <TotalCountsTableWrapped {...this.props} />;
  }
});

export default TotalCounts;
