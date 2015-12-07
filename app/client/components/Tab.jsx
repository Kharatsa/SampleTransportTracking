'use strict';

import React, {createClass, PropTypes} from 'react';
import classNames from 'classnames';

export default React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    active: PropTypes.bool
  },

  render: function() {
    var tabClass = classNames({
      'mdl-layout__tab': true,
      'is-active': typeof this.props.active !== 'undefined' ? this.props.active : false
    });
    return (<a className={tabClass}>{this.props.title}</a>);
  }
});

