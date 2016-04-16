import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import TotalCountsTable from './TotalCountsTable';

const TotalCountsTableWrapped = WaitOnFetch(TotalCountsTable);

export const TotalCounts = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    summaryFilter: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func).isRequired
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
    const {fetchSummary} = this.props.actions;
    fetchSummary(filter);
  },

  render() {
    return <TotalCountsTableWrapped {...this.props} />;
  }
});

export default TotalCounts;
