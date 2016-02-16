'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    values: PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  render: function() {
    const {values} = this.props;
    const cellElems = values.map(value => <td>{value}</td>);
    return <tr>{cellElems}</tr>;
  }
});
