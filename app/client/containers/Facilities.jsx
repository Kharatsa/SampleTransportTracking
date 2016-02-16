import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import * as actions from '../actions/actioncreators.js';

const Facilities = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return <div className='panel'>TODO FACILITIES</div>;
  }
});

export default connect(
  state => ({})
  // dispatch => ({actions: {})
)(Facilities);
