'use strict';

import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default React.createClass({
  propTypes: {
    fetchPage: PropTypes.func.isRequired,
    toPage: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  },

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  shouldComponentUpdate(nextProps) {
    const {active, text} = this.props;
    return nextProps.active === active && nextProps.text === text;
  },

  handlePageChange() {
    const {toPage, fetchPage, disabled} = this.props;
    if (!disabled) {
      fetchPage(toPage);
    }
  },

  render() {
    const {disabled, text} = this.props;

    const pureButton = classNames({
      'pure-button': true,
      'pure-button-disabled': disabled
    });

    const buttonStyle = {
      display: 'inline-block'
    };

    return (
      <button
        className={pureButton}
        style={buttonStyle}
        onClick={this.handlePageChange}>
        {text}
      </button>
    );
  }
});
