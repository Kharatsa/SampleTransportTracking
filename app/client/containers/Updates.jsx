'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Paper from 'material-ui/lib/paper';
import * as actions from '../actions/actioncreators.js';
import LatestUpdates from '../components/LatestUpdates.jsx';

const Updates = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    const {fetchUpdates} = this.props.actions;
    fetchUpdates();
  },

  // shouldComponentUpdate: function(nextProps) {
  //   const {updates, updatesById} = this.props;
  //   let nextUpdates = nextProps.updates;
  //   let nextUpdatesById = nextProps.updatesById;
  //   return updates.equals(nextUpdates) && updatesById.equals(nextUpdatesById);
  // },

  render: function() {
    const {updates, updatesById} = this.props;

    return (
      <div className='flexitem'>
        <Paper>
          <LatestUpdates updates={updates} updatesById={updatesById} />
        </Paper>
      </div>
    );
  }
});

export default connect(
  state => ({updates: state.updates, updatesById: state.updatesById}),
  dispatch => ({actions: bindActionCreators({fetchUpdates: actions.fetchUpdates}, dispatch)})
)(Updates);
