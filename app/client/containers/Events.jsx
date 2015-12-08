'use strict';

import React, {createClass, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Paper from 'material-ui/lib/paper';
import * as actions from '../actions/actioncreators.js';
import LatestEvents from '../components/LatestEvents.jsx';

const Events = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount: function() {
    const {fetchEvents} = this.props.actions;
    fetchEvents();
  },

  // shouldComponentUpdate: function(nextProps) {
  //   const {events, eventsById} = this.props;
  //   let nextEvents = nextProps.events;
  //   let nextEventsById = nextProps.eventsById;
  //   return events.equals(nextEvents) && eventsById.equals(nextEventsById);
  // },

  render: function() {
    const {events, eventsById} = this.props;

    return (
      <div className='flexitem'>
        <Paper>
          <LatestEvents events={events} eventsById={eventsById} />
        </Paper>
      </div>
    );
  }
});

export default connect(
  state => ({events: state.events, eventsById: state.eventsById}),
  dispatch => ({actions: bindActionCreators({fetchEvents: actions.fetchEvents}, dispatch)})
)(Events);
