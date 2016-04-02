'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeWindowSize} from '../../actions/actioncreators.js';

const DEBOUNCE_MILLIS = 16;
const NARROW_WIDTH_BUFFER = 0;


const WIDTH_BUFFER_MENU = 275;
const WIDTH_BUFFER = 75;

const HEIGHT_BUFFER = 200;

/**
 * [description]
 * @param  {React.Component} Component [description]
 * @param  {Object} options   [description]
 * @param {boolean} [options.width=true] [description]
 * @param {boolean} [options.height=true] [description]
 * @return {React.Component}           [description]
 */
export const WindowSizeListen = (Component, options) => {
  // Defaults
  options = options || {};
  const {width=true, height=true, isMenuPage=false} = options;
  const widthBuffer = isMenuPage ? WIDTH_BUFFER_MENU : WIDTH_BUFFER;

  const Wrapped = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      width: PropTypes.number,
      height: PropTypes.number
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
      const {width, height} = this.props;
      const {changeWindowSize} = this.props.actions;

      const win = window;

      const widthOffset = (
        win.innerWidth < 680 ? NARROW_WIDTH_BUFFER : widthBuffer);
      const newWidth = win.innerWidth - widthOffset;
      const newHeight = win.innerHeight - HEIGHT_BUFFER;

      if (!width || width !== newWidth || !height || height !== newHeight) {
        changeWindowSize(newWidth, newHeight);
      }
    },

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  });

  return connect(
    state => {
      let result = {};
      if (width) {
        result.width = state.windowSize.get('innerWidth');
      }
      if (height) {
        result.height = state.windowSize.get('innerHeight');
      }
      return result;
    },
    dispatch => ({actions: bindActionCreators({changeWindowSize}, dispatch)})
  )(Wrapped);
};

export default WindowSizeListen;
