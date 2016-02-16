'use strict';

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table} from 'fixed-data-table';
import {changeWindowSize} from '../actions/actioncreators.js';

const DEBOUNCE_MILLIS = 16;

const resizeListener = Component => {
  return React.createClass({
    mixins: [PureRenderMixin],

    componentDidMount() {
      this._update();
      const win = window;
      if (win.addEventListener) {
        win.addEventListener('resize', this._onResize, false);
      } else if (win.attachEvent) {
        win.attachEvent('onresize', this._onResize);
      } else {
        win.onresize = this._onResize;
      }
    },

    componentWillUnmount() {
      const win = window;

      if (win.removeEventListener) {
        win.removeEventListener('resize', this._onResize, false);
      }
    },

    _onResize() {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(this._update, DEBOUNCE_MILLIS);
    },

    _update() {
      const {changeWindowSize} = this.props.actions;

      const win = window;

      const widthOffset = win.innerWidth < 680 ? 0 : 150;
      const width = win.innerWidth - widthOffset;
      const height = win.innerHeight - 200;

      changeWindowSize(width, height);
    },

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });
};

export default connect(
  state => ({width: state.windowSize.get('innerWidth')}),
  dispatch => ({actions: bindActionCreators({changeWindowSize}, dispatch)})
)(resizeListener(Table));
