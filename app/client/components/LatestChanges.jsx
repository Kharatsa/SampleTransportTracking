'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Set as ImmutableSet, Map as ImmutableMap} from 'immutable';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    changes: PropTypes.instanceOf(ImmutableSet),
    changesById: PropTypes.instanceOf(ImmutableMap)
  },

  render: function() {
    return <div className='panel'><p>TODO CHANGES</p></div>;
    // const {changesById, changes} = this.props;

    // const columnNames = {
    //   'id': 'ID',
    //   'stId': 'ST ID',
    //   'labId': 'Lab ID',
    //   'form': 'Status',
    //   'sampleStatus': 'Condition',
    //   'facility': 'Facility',
    //   'person': 'Person'
    // };

    // const settings = {
    //   height: '350px',
    //   showRowHover: true
    // };

    // const columnKeys = Object.keys(columnNames);
    // const columnHeaders = columnKeys.map(function(colKey, i) {
    //   let columnValue = columnNames[colKey];
    //   return <TableHeaderColumn key={i}>{columnValue}</TableHeaderColumn>;
    // });

    // const tableRows = changes.map(function(eventId, i) {
    //   let event = changesById.get(eventId.toString());

    //   let rowValues = columnKeys.map(function(colKey, j) {
    //     let rowValue = event[colKey];
    //     return <TableRowColumn key={j}>{rowValue}</TableRowColumn>;
    //   });

    //   return <TableRow selected={false} key={i}>{rowValues}</TableRow>;
    // });

    // return (
    //   <div>
    //     <Table height={settings.height}>
    //       <TableHeader enableSelectAll={false}>
    //         <TableRow>
    //           {columnHeaders}
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody showRowHover={true}>
    //         {tableRows}
    //       </TableBody>
    //     </Table>
    //   </div>

    // );
  }
});
