import React, {createClass, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions/actioncreators.js';
import Paper from 'material-ui/lib/paper';

const Riders = React.createClass({
  componentDidMount: function() {
    // TODO
  },

  render: function() {
    return (
      <div className='flexitem'>
        <Paper>Riders</Paper>
      </div>
    );
  }
});

export default connect(
  state => ({})
  // dispatch => ({actions: {})
)(Riders);
