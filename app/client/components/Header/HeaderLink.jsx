'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import Link from 'react-router/lib/Link';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    location: PropTypes.object,
    text: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool
  },

  isSelected() {
    const {location, matchRoutes} = this.props;
    const basePath = location.pathname.split('/').slice(0, 2).join('/');

    if (Array.isArray(matchRoutes)) {
      return matchRoutes.some(route => route === basePath);
    }
    return matchRoutes === basePath;
  },

  getDefaultProps: function() {
    return {
      linkTo: '#',
      active: false,
      disabled: false
    };
  },

  render: function() {
    const {linkTo, disabled, text} = this.props;

    const itemClass = classNames({
      'pure-menu-item': true,
      'pure-menu-selected': this.isSelected(),
      'pure-menu-disabled': disabled || false
    });

    return (
      <li className={itemClass}>
        <Link to={linkTo} className='pure-menu-link'>{text}</Link>
      </li>
    );
  }
});
