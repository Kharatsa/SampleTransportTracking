import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map as ImmutableMap, List, Record} from 'immutable';
import WaitOnFetch from '../../containers/wrappers/WaitOnFetch.jsx';
import TurnAroundsTable from './TurnAroundsTable';
import TurnAroundsChart from './TurnAroundsChart';

const TurnAroundsTableWrapped = WaitOnFetch(TurnAroundsTable);
const TurnAroundsChartWrapped = WaitOnFetch(TurnAroundsChart);

export const TurnArounds = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    summaryFilter: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
    metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
    stagesTATs: PropTypes.instanceOf(List).isRequired,
    endToEndTAT: PropTypes.instanceOf(Record).isRequired
  },

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
    const {metaStages, metaStatuses, stagesTATs, endToEndTAT} = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsChartWrapped
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
          />
        </div>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsTableWrapped
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
            endToEndTAT={endToEndTAT}
          />
        </div>
      </div>);
  }
});

export default TurnArounds;
