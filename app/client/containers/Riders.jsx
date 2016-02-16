import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import * as actions from '../actions/actioncreators.js';

const Riders = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return <div className='panel'>TODO RIDERS</div>;
  }
});

export default connect(
  state => ({})
  // dispatch => ({actions: {})
)(Riders);
