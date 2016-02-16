'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames';
import Link from 'react-router/lib/Link';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    route: PropTypes.string,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      route: '#',
      disabled: false
    };
  },

  isSelected: function() {
    const {location, route} = this.props;
    return location.pathname === route;
  },

  navigate: function() {
    const {changeRoute, route} = this.props;
    changeRoute(route);
  },

  render: function() {
    const {disabled, text, route} = this.props;

    const itemClass = classNames({
      'pure-menu-item': true,
      'pure-menu-selected': this.isSelected(),
      'pure-menu-disabled': disabled || false
    });

    return (
      <li className={itemClass}>
        <Link to={route} className='pure-menu-link'>{text}</Link>
      </li>
    );
  }
});
