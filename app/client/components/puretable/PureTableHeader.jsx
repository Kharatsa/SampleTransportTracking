'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headers: PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  render: function() {
    const {headers} = this.props;
    const headerElems = headers.map(header => <th>{header}</th>);

    return <thead><tr>{headerElems}</tr></thead>;
  }
});
