'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators.js';
import LatestChanges from '../components/LatestChanges/LatestChanges.jsx';
import WaitOnFetch from './wrap/WaitOnFetch.jsx';

const LatestChangesWrapped = WaitOnFetch(LatestChanges);

const Changes = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (nextProps.isFetchingData) {
      return false;
    }

    // Strict equality for speed
    return (!(
      this.props.isFetchingData === nextProps.isFetchingData &&
      this.props.changesById === nextProps.changesById &&
      this.props.samplesById === nextProps.samplesById &&
      this.props.artifactsById === nextProps.artifactsById &&
      this.props.labTestsById === nextProps.labTestsById &&
      this.props.metadata === nextProps.metadata
    ));
  },

  componentWillMount() {
    const {page} = this.props.params;
    const {fetchChanges} = this.props.actions;
    const {summaryFilter} = this.props;
    console.log('page: ', page)
    fetchChanges(summaryFilter, page);
  },

  componentWillReceiveProps(nextProps) {
    const {page} = this.props.params;
    if (nextProps.params.page !== page) {
      const {fetchChanges} = this.props.actions;
      const {summaryFilter} = this.props;
      console.log('page: ', page)
      fetchChanges(summaryFilter, nextProps.params.page);
    }
  },

  render() {
    return <LatestChangesWrapped {...this.props} />;
  }
});

export default connect(
  state => ({
    changeIds: state.changeIds,
    changesById: state.changesById,
    changesTotal: state.changesTotal,
    samplesById: state.samplesById,
    artifactsById: state.artifactsById,
    labTestsById: state.labTestsById,
    metadata: state.metadata,
    page: state.page,
    isFetchingData: state.isFetchingData,
    summaryFilter: state.summaryFilter
  }),
  dispatch => ({actions: bindActionCreators({fetchChanges}, dispatch)})
)(Changes);
