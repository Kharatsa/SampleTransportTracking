import React, {PropTypes} from 'react';
import Chartist from 'chartist';

/*
 * adapted from https://github.com/fraserxu/react-chartist
 */

export const ChartistGraph = React.createClass({
  propTypes: {
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.object,
    responsiveOptions: PropTypes.array,
    style: PropTypes.object
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  },

  getDefaultProps() {
    return {
      className: '',
      style: {},
      options: {},
      responsiveOptions: []
    };
  },

  componentWillUpdate(newProps) {
    this.updateChart(newProps);
  },

  componentWillUnmount() {
    if (this.chartist) {
      try {
        this.chartist.detach();
      } catch (err) {
        throw new Error('Internal chartist error', err);
      }
    }
  },

  componentDidMount() {
    this.updateChart(this.props);
  },

  updateChart({type, data, options, responsiveOptions, listener}) {
    let event;

    if (this.chartist) {
      this.chartist.update(data, options, responsiveOptions);
    } else {
      this.chartist = new Chartist[type](this._chart, data, options,
                                         responsiveOptions);

      if (typeof listener !== 'undefined') {
        for (event in listener) {
          if (listener.hasOwnProperty(event)) {
            this.chartist.on(event, listener[event]);
          }
        }
      }
    }

    return this.chartist;
  },

  render() {
    const {className, style} = this.props;
    return (
      <div
        className={`ct-chart ${className}`}
        ref={c => this._chart = c}
        style={style}
      />);
  }
});

export default ChartistGraph;
