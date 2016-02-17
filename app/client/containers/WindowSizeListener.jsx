'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeWindowSize} from '../actions/actioncreators.js';

const DEBOUNCE_MILLIS = 16;

const windowSizeListen = Component => {
  const Wrapped = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    },

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

  return connect(
    state => ({
      width: state.windowSize.get('innerWidth'),
      height: state.windowSize.get('innerHeight')
    }),
    dispatch => ({actions: bindActionCreators({changeWindowSize}, dispatch)})
  )(Wrapped);
};

export default windowSizeListen;
