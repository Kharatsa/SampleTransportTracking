'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TableHeader from './TableHeader.jsx';
import TableRow from './TableRow.jsx';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    headers: PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  render: function() {
    const {headers, rows} = this.props;
    const rowElems = rows.map(values => <TableRow values={values} />);

    return (
      <table className='pure-table pure-table-bordered'>
        <TableHeader headers={headers} />
        <tbody>
          {rowElems}
        </tbody>
      </table>
    );
  }
});
