'use strict';

import React, {PropTypes} from 'react';
import Link from 'react-router/lib/Link';
import classNames from 'classnames';

export default React.createClass({
  propTypes: {
    fetchPage: PropTypes.func.isRequired,
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

  render() {
    const {disabled, text, linkTo} = this.props;

    const pureButton = classNames({
      'pure-button': true,
      'pure-button-disabled': disabled
    });

    const buttonStyle = {
      display: 'inline-block'
    };

    const buttonElem = (
      <button
          className={pureButton}
          style={buttonStyle}>
        {text}
      </button>
    );

    const linkedButtonElem = (
      disabled ?
      <span>{buttonElem}</span> :
      <Link to={linkTo}>{buttonElem}</Link>
    );

    return linkedButtonElem;
  }
});
