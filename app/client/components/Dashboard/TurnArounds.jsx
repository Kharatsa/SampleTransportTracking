import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map as ImmutableMap, List} from 'immutable';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import TurnAroundsTable from './TurnAroundsTable';

const TurnAroundsTableWrapped = WaitOnFetch(TurnAroundsTable);

export const TurnArounds = React.createClass({
  propTypes: {
    summaryFilter: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
    metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
    turnArounds: PropTypes.instanceOf(List).isRequired
  },

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
    const {metaStages, metaStatuses, turnArounds} = this.props;

    return (
      <div>
        <strong>Turn Around Times</strong>
        <TurnAroundsTableWrapped
          metaStages={metaStages}
          metaStatuses={metaStatuses}
          turnArounds={turnArounds}
        />
      </div>
      );
  }
});

export default TurnArounds;
