import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import TurnAroundsTable from './TurnAroundsTable';

const TurnAroundsTableWrapped = WaitOnFetch(TurnAroundsTable);

export const TurnArounds = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this._update(this.props.summaryFilter);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.summaryFilter !== this.props.summaryFilter) {
      this._update(nextProps.summaryFilter);
    }
  },

  _update(filter) {
    const {fetchTurnArounds} = this.props.actions;
    fetchTurnArounds(filter);
  },

  render() {
    return <TurnAroundsTableWrapped {...this.props} />;
  }
});

export default TurnArounds;
