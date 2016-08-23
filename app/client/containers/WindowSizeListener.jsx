import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const DEBOUNCE_MILLIS = 16;
const NARROW_WIDTH_BUFFER = 0;
const WIDTH_BUFFER_MENU = 275;
const WIDTH_BUFFER = 75;
const HEIGHT_BUFFER = 200;

const calculateSize = (widthBuffer) => {
  const win = window;

  const widthOffset = win.innerWidth < 680 ? NARROW_WIDTH_BUFFER : widthBuffer;

  return {
    width: win.innerWidth - widthOffset,
    height: win.innerHeight - HEIGHT_BUFFER
  };
};

/**
 * Wrapper Component that updates innerWidth and innerHeight in state
 *
 * @param  {React.Component} Component
 * @param  {Object} options
 * @param {boolean} [options.changeWidth=true]
 * @param {boolean} [options.changeHeight=true]
 * @param {boolean} [options.avoidSideMenu=false]
 * @return {React.Component}
 */
export const WindowSizeListen = (Component, options) => {
  // Defaults
  options = options || {};
  const {changeWidth=true, changeHeight=true, avoidSideMenu=false} = options;
  const widthBuffer = avoidSideMenu ? WIDTH_BUFFER_MENU : WIDTH_BUFFER;
  // const {width: originalWidth, height: originalHeight} = Component.props;

  return React.createClass({
    propTypes: {
      width: PropTypes.number,
      height: PropTypes.number
    },

    getInitialState: function() {
      return calculateSize(widthBuffer);
    },

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
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
      const {width, height} = this.state;
      const {width: newWidth, height: newHeight} = calculateSize(widthBuffer);

      if (!width || width !== newWidth || !height || height !== newHeight) {
        this.setState({
          width: newWidth,
          height: newHeight
        });
      }
    },

    render() {
      const {width, height} = this.state;

      let dimensionsProps = {};
      if (changeWidth) {
        dimensionsProps.width = width;
      }
      if (changeHeight) {
        dimensionsProps.height = height;
      }

      const props = Object.assign({}, this.props, dimensionsProps);

      return React.createElement(Component, props);
    }
  });
};

export default WindowSizeListen;
