'use strict';

import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {List, Map as ImmutableMap} from 'immutable';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';


export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    updates: PropTypes.instanceOf(List),
    updatesById: PropTypes.instanceOf(ImmutableMap)
  },

  render: function() {
    const {updatesById, updates} = this.props;

    const columnNames = {
      'id': 'ID',
      'stId': 'ST ID',
      'labId': 'Lab ID',
      'form': 'Status',
      'sampleStatus': 'Condition',
      'facility': 'Facility',
      'person': 'Person'
    };

    const settings = {
      height: '350px',
      showRowHover: true,
    };

    const columnKeys = Object.keys(columnNames);
    const columnHeaders = columnKeys.map(function(colKey, i) {
      let columnValue = columnNames[colKey];
      return <TableHeaderColumn key={i}>{columnValue}</TableHeaderColumn>
    });

    const tableRows = updates.map(function(eventId, i) {
      let event = updatesById.get(eventId.toString());

      let rowValues = columnKeys.map(function(colKey, j) {
        let rowValue = event[colKey];
        return (<TableRowColumn key={j}>{rowValue}</TableRowColumn>);
      });

      return (
        <TableRow selected={false} key={i}>{rowValues}</TableRow>
      );
    });

    return (
      <div>
        <Table height={settings.height}>
          <TableHeader enableSelectAll={false}>
            <TableRow>
              {columnHeaders}
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {tableRows}
          </TableBody>
        </Table>
      </div>

    );
  }
});
