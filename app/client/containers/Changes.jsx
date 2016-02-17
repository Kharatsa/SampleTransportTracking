'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators.js';
import ChangesTable from '../components/ChangesTable.jsx';

const Changes = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (nextProps.isFetchingData) {
      return false;
    }

    // Uses strict equality for speed
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
    const {fetchChanges} = this.props.actions;
    fetchChanges();
  },

  render() {
    return (
      <div>
        <ChangesTable {...this.props} />
      </div>
    );
  }
});

export default connect(
  state => ({
    changeIds: state.changeIds,
    changesById: state.changesById,
    samplesById: state.samplesById,
    artifactsById: state.artifactsById,
    labTestsById: state.labTestsById,
    isFetchingData: state.isFetchingData,
    metadata: state.metadata
  }),
  dispatch => ({
    actions: bindActionCreators({fetchChanges}, dispatch)
  })
)(Changes);
