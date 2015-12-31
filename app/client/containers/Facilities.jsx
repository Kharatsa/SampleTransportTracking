import React, {PropTypes} from 'react';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import * as actions from '../actions/actioncreators.js';
import Paper from 'material-ui/lib/paper';

const Facilities = React.createClass({
  componentDidMount: function() {
    // TODO
  },

  render: function() {
    return (
      <div className='flexitem'>
        <Paper>Facilities</Paper>
      </div>
    );
  }
});

export default connect(
  state => ({})
  // dispatch => ({actions: {})
)(Facilities);
