'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchChanges} from '../actions/actioncreators.js';
import LatestChanges from '../components/LatestChanges.jsx';

const Changes = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    const {fetchChanges} = this.props.actions;
    fetchChanges();
  },

  render: function() {
    const {changes, changesById} = this.props;

    return (
      <div>
        <LatestChanges changes={changes} changesById={changesById} />
      </div>
    );
  }
});

export default connect(
  state => ({changes: state.changes, changesById: state.changesById}),
  dispatch => ({
    actions: bindActionCreators({fetchChanges}, dispatch)
  })
)(Changes);
