import React from 'react'; // eslint-disable-line no-unused-vars
import TotalCountsTable from './TotalCountsTable';
import WaitOnFetch from '../../containers/wrap/WaitOnFetch.jsx';

const TotalCountsTableWrapped = WaitOnFetch(TotalCountsTable);

class TotalCounts extends React.Component {

  componentWillMount() {
    const {summaryFilter} = this.props;
    const {fetchSummary} = this.props.actions;
    fetchSummary(summaryFilter);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.summaryFilter !== this.props.summaryFilter) {
      const {fetchSummary} = this.props.actions;
      fetchSummary(nextProps.summaryFilter);
    }
  }

  render() {
    return <TotalCountsTable {...this.props} />;
  }

}

export default TotalCounts;
