'use strict';

/* global componentHandler */

import React, {createClass, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  // componentDidUpdate: function() {
  //   // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
  //   // componentHandler.upgradeDom();

  //   // We could have done this manually for each component

  //    * let submitButton = this.refs.submit.getDOMNode();
  //    * componentHandler.upgradeElement(submitButton, "MaterialButton");
  //    * componentHandler.upgradeElement(submitButton, "MaterialRipple");

  // },


  render: function() {
    const {samplesById, samples} = this.props;

    return (
      // Total samples: <span>{samples.size}</span>
      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Sample Tracking ID</th>
            <th>Lab ID</th>
          </tr>
        </thead>
        <tbody>
          {samplesById.toArray().map(
            sample => (
              <tr key={sample.id}>
                <td>{sample.stId}</td>
                <td>{sample.labId}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    );
  }
});
