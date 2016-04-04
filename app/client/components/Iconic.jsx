import React, {PropTypes} from 'react';
import SVGInjector from 'svg-injector';

const ICONIC_PATH = '/icons';

const injectorOptions = {
  evalScripts: 'once',
  pngFallback: '/icons'
};

/**
 * Based on pixel size, return the correct Iconic PNG size suffix.
 * 8x8    - base file
 * 16x16  - 2x
 * ...
 * 64x64  - 8x
 *
 * @param  {[type]} sizePx [description]
 * @return {[type]}        [description]
 */
const fallBackPNGSize = sizePx => {
  let result;
  if (sizePx < 16) {
    result = null;
  } else if (sizePx < 24) {
    result = 2;
  } else if (sizePx < 32) {
    result = 3;
  } else if (sizePx < 48) {
    result = 4;
  } else if (sizePx < 64) {
    result = 6;
  } else {
    result = 8;
  }
  return result !== null ? `-${result}x` : '';
};

const fallBackPNG = (name, size) => {
  return `${ICONIC_PATH}/${name}${fallBackPNGSize(size)}.png`;
};

export const Iconic = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    classNames: PropTypes.string
  },

  getInitialState: function() {
    return {injected: false};
  },

  getDefaultProps() {
    return {
      classNames: null,
      color: 'black',
      sizePx: 10
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.injected !== this.state.injected;
  },

  componentDidMount() {
    SVGInjector([this._img], injectorOptions, () => {
      this.setState({injected: true});
    });
  },

  render() {
    const {name, className, sizePx, color} = this.props;

    const iconStyles = {
      width: `${sizePx}px`,
      height: `${sizePx}px`,
      fill: color
    };

    return <img className={className}
                style={iconStyles}
                data-src={`${ICONIC_PATH}/${name}.svg`}
                data-fallback={fallBackPNG(name, sizePx)}
                ref={(c) => this._img = c} />;
  }
});

export default Iconic;
