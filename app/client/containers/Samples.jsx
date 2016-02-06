import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import * as actions from '../actions/actioncreators.js';

const Samples = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className='panel'>TODO SAMPLES</div>;
  }
});

export default connect(
  state => ({})
  // dispatch => ({actions: {})
)(Samples);
